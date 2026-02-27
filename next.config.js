/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@supabase/supabase-js', '@supabase/ssr'],
  images: {
    unoptimized: true,
  },
  // Fix for CSS issues on Vercel
  swcMinify: true,
  // Ensure CSS is properly extracted
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
