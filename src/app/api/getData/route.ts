import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiEndpoint = process.env.ASTRA_DB_API_ENDPOINT;
    const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
    const keyspace = "default_keyspace";
    const collection = "articles";

    // Detailed environment variable logging
    console.log("Environment Variables Check:", {
      apiEndpoint,
      token: token ? `${token.substring(0, 10)}...` : null,
      tokenLength: token?.length,
      keyspace,
      collection,
      nodeEnv: process.env.NODE_ENV,
    });

    if (!apiEndpoint || !token) {
      console.error("Missing required environment variables:", {
        hasApiEndpoint: !!apiEndpoint,
        hasToken: !!token,
      });
      throw new Error("Missing required environment variables");
    }

    const url = `${apiEndpoint}/api/json/v1/${keyspace}/${collection}`;
    console.log("Making request to:", url);

    // Try with explicit headers and request options
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Token": token,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        find: {}
      }),
      // Add these options to match curl behavior
      redirect: "follow",
      cache: "no-cache",
      credentials: "omit",
    });

    // Log the full request details
    console.log("Request details:", {
      url,
      method: "POST",
      headers: {
        "Token": `${token.substring(0, 10)}...`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    // Log response details
    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("API response data:", data);

    return NextResponse.json({ products: data.data || [] });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
