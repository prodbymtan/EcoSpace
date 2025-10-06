/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.nasa.gov', 'earthdata.nasa.gov'],
  },
  env: {
    NASA_API_KEY: process.env.NASA_API_KEY,
  },
}

module.exports = nextConfig
