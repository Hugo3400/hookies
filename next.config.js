/** @type {import('next').NextConfig} */
const forceDev = process.env.FORCE_DEV === '1';
const isDevRuntime = forceDev || process.env.NODE_ENV !== 'production';

const nextConfig = {
  reactStrictMode: true,
  distDir: isDevRuntime ? '.next-dev' : '.next',
  images: {
    unoptimized: true,
  },
  env: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  },
};

module.exports = nextConfig;
