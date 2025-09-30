/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  transpilePackages: ['chart.js'],
}

module.exports = nextConfig