import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Désactive la vérification ESLint pendant le build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
