import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Only use standalone output for production builds
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  typescript: {
    // Disable TypeScript errors during builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during builds (warnings will still show but won't fail build)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
