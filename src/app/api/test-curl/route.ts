import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET() {
  try {
    const apiEndpoint = process.env.ASTRA_DB_API_ENDPOINT;
    const token = "AstraCS:QEmWxIEjFYhDIqTcTSiJBSIz:3356339e7d031efca3ecbbaf273a77ff6202ec1a0950aa561b23a817b5ef27c0";
    const keyspace = "default_keyspace";
    const collection = "products";

    // Debug token
    console.log("API Endpoint:", apiEndpoint);
    console.log("Token length:", token.length);
    console.log("Token starts with:", token.substring(0, 10));
    console.log("Token format check:", token.startsWith("AstraCS:"));

    const curlCommand = `curl -sS -L -X POST "${apiEndpoint}/api/json/v1/${keyspace}/${collection}" \
--header "Token: ${token}" \
--header "Content-Type: application/json" \
--data '{ "find": {} }'`;

    console.log("Executing curl command (with masked token):", 
      curlCommand.replace(token, "***MASKED***"));

    const { stdout, stderr } = await execAsync(curlCommand);

    if (stderr) {
      console.error("Curl error:", stderr);
      throw new Error(stderr);
    }

    console.log("Curl response:", stdout);

    try {
      const data = JSON.parse(stdout);
      if (data.errors) {
        console.error("API returned errors:", data.errors);
        throw new Error(data.errors[0]?.message || "API returned errors");
      }
      return NextResponse.json({ products: data.data?.documents || [] });
    } catch (error) {
      console.error("Parse error:", error);
      throw new Error("Failed to parse curl response");
    }
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
