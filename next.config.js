/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    domains: ['images.unsplash.com', 'i.swncdn.com','firebasestorage.googleapis.com','ctd-thechristianpost.netdna-ssl.com','cdn.christianpost.com','www1.cbn.com'],
  },
}

module.exports = nextConfig
