import { NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";

// Initialize Astra DB client
const client = new DataAPIClient(
  "AstraCS:BFyZkWeCtltMOybYFJZGqUqE:24ad72d56df507fbd87201b0399f554dc4ae705982dbcd86fe42957e6f04b16b"
);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!);

interface HybridSortOptions {
  sort: {
    $hybrid: {
      $vectorize: string;
      $lexical?: string;
    };
  };
  limit?: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const terms = searchParams.get('terms');
  const collectionName = 'products';

  try {
    // Log environment variables (without exposing full token)
    console.log("Environment check:", {
      hasToken: !!process.env.ASTRA_DB_APPLICATION_TOKEN,
      tokenLength: process.env.ASTRA_DB_APPLICATION_TOKEN?.length,
      hasEndpoint: !!process.env.ASTRA_DB_API_ENDPOINT,
      endpoint: process.env.ASTRA_DB_API_ENDPOINT,
    });

    console.log("Connecting to collection:", collectionName);
    const collection = db.collection(collectionName);

    if (!query && !terms) {
      // If no query or terms, return all products
      console.log("No query or terms provided, fetching all products");
      const cursor = collection.find({}, { limit: 25 });

      const products = [];
      for await (const document of cursor) {
        products.push(document);
      }
      console.log(`Found ${products.length} products`);
      return NextResponse.json({ products });
    }

    const sortOptions: HybridSortOptions = {
      sort: {
        $hybrid: {
          $vectorize: query || "",
        },
      },
      limit: 25,
    };

    if (terms) {
      sortOptions.sort.$hybrid.$lexical = terms;
    }

    console.log("Performing hybrid search with options:", sortOptions);
    const cursor = collection.findAndRerank({}, sortOptions);

    const products = [];
    for await (const result of cursor) {
      products.push(result.document);
    }
    console.log(`Found ${products.length} products in hybrid search`);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Hybrid search error:", error);
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
        error: "Failed to perform hybrid search",
        details: {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : "Unknown",
        },
      },
      { status: 500 }
    );
  }
}
