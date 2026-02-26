/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@supabase/supabase-js', '@supabase/ssr'],
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
