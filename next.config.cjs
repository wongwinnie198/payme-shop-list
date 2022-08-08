/** @type {import('next').NextConfig} */
const path = require("path");
// import { path } from "path";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

module.exports = nextConfig;
