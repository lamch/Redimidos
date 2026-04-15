/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.swncdn.com' },
      { protocol: 'https', hostname: 'ctd-thechristianpost.netdna-ssl.com' },
      { protocol: 'https', hostname: 'cdn.christianpost.com' },
      { protocol: 'https', hostname: 'www1.cbn.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
}

module.exports = nextConfig
