import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Enables unauthorized() and forbidden() from 'next/navigation'
    authInterrupts: true,
  },
};

export default nextConfig;
