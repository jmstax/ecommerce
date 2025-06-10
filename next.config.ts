import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ASTRA_DB_API_ENDPOINT: process.env.ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN: process.env.ASTRA_DB_APPLICATION_TOKEN,
  },
};

export default nextConfig;
