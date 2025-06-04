/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    //missingSuspenseWithCSRBailout: false,
    serverActions: {
      bodySizeLimit:"100mb",
    },
  },

}
  module.exports = nextConfig;