/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ipfs.io",
      "example.com",
      "anotherdomain.com",
      "gateway.pinata.cloud",
    ],
  },
};

module.exports = nextConfig;
