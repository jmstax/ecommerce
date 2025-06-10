import { NextResponse } from "next/server";
import https from 'https';

export async function GET() {
  return new Promise((resolve) => {
    const apiEndpoint = process.env.ASTRA_DB_API_ENDPOINT;
    const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
    const keyspace = "default_keyspace";
    const collection = "articles";

    const url = new URL(`${apiEndpoint}/api/json/v1/${keyspace}/${collection}`);
    
    console.log("Making HTTP request to:", url.toString());

    const options = {
      method: 'POST',
      headers: {
        'Token': token,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response headers:', res.headers);
        
        if (res.statusCode !== 200) {
          console.error('Error response:', data);
          resolve(NextResponse.json(
            { 
              error: "Failed to fetch products",
              details: data,
            },
            { status: res.statusCode || 500 }
          ));
          return;
        }

        try {
          const jsonData = JSON.parse(data);
          console.log('Response data:', jsonData);
          resolve(NextResponse.json({ products: jsonData.data || [] }));
        } catch (error) {
          console.error('Parse error:', error);
          resolve(NextResponse.json(
            { 
              error: "Failed to parse response",
              details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
          ));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      resolve(NextResponse.json(
        { 
          error: "Request failed",
          details: error.message,
        },
        { status: 500 }
      ));
    });

    req.write(JSON.stringify({ find: {} }));
    req.end();
  });
} 