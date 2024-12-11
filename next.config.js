/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Expose environment variables to the client-side only when necessary
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Example public variable
  },
  serverRuntimeConfig: {
    // Server-side only variables
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_NAME: process.env.DATABASE_NAME,
  },
  publicRuntimeConfig: {
    // Publicly available variables (if needed)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  future: { 
    webpack5: true,
  },
};

module.exports = nextConfig;
