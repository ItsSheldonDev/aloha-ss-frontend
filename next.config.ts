// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Désactive la vérification ESLint pendant la compilation
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.aloha-secourisme.fr',
        pathname: '/uploads/galerie/**', // Autorise tous les chemins sous /uploads/galerie
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.aloha-secourisme.fr/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;