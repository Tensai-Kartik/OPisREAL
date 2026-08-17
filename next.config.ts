import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
      {
        protocol: 'https',
        hostname: 'images.api-onepiece.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.alphacoders.com',
      },
      {
        protocol: 'https',
        hostname: 'images2.alphacoders.com',
      },
      {
        protocol: 'https',
        hostname: 'images3.alphacoders.com',
      },
      {
        protocol: 'https',
        hostname: 'images5.alphacoders.com',
      },
      {
        protocol: 'https',
        hostname: 'images6.alphacoders.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/play',
        destination: '/',
        permanent: true,
      },
      {
        source: '/game',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/feedback',
        destination: '/?feedback=true',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
