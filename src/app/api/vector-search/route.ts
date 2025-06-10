import { NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";

// Initialize Astra DB client
const client = new DataAPIClient(
  "AstraCS:BFyZkWeCtltMOybYFJZGqUqE:24ad72d56df507fbd87201b0399f554dc4ae705982dbcd86fe42957e6f04b16b"
);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!);

interface VectorSortOptions {
  sort: {
    $vectorize: string;
  };
  limit?: number;
}

export async function GET(request: Request) {
  console.log('API route received request:', request.url);
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const collectionName = 'products';

    console.log("Connecting to collection:", collectionName);
    const collection = db.collection(collectionName);

    if (!query) {
      // If no query, return all products
      console.log("No query provided, fetching all products");
      const cursor = collection.find({}, { limit: 25 });

      const products = [];
      for await (const document of cursor) {
        products.push(document);
      }
      console.log(`Found ${products.length} products`);
      return NextResponse.json({ products });
    }

    // If query is present, use vector search
    const sortOptions: VectorSortOptions = {
      sort: {
        $vectorize: query,
      },
      limit: 25,
    };

    console.log("Performing vector search with options:", sortOptions);
    const cursor = collection.find({}, sortOptions);

    const products = [];
    for await (const document of cursor) {
      products.push(document);
    }
    console.log(`Found ${products.length} products in vector search`);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Vector search error:", error);
    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes("UNAUTHENTICATED")) {
      console.error("Authentication error details:", {
        endpoint: process.env.ASTRA_DB_API_ENDPOINT,
        tokenLength: process.env.ASTRA_DB_APPLICATION_TOKEN?.length,
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack,
      });
      return NextResponse.json(
        {
          error:
            "Authentication failed. Please check your Astra DB credentials.",
          details: {
            message: error.message,
            name: error.name,
          },
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        error: "Failed to perform vector search",
        details: {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : "Unknown",
        },
      },
      { status: 500 }
    );
  }
}
