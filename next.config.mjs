const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["wallet-adapter-react", "wallet-adapter-plugin"],
  assetPrefix: isProd ? "/AptosMarketMakingBot" : "",
  basePath: isProd ? "/AptosMarketMakingBot" : "",
  webpack: (config) => {
    config.resolve.fallback = { "@solana/web3.js": false };
    return config;
  },
};


// const nextConfig = {
//   reactStrictMode: true,
//   transpilePackages: ["wallet-adapter-react", "wallet-adapter-plugin"],
//   assetPrefix: isProd ? "/AptosMarketMakingBot" : "",
//   basePath: isProd ? "/AptosMarketMakingBot" : "",
//   webpack: (config) => {
//     config.resolve.fallback = { "@solana/web3.js": false };
//     return config;
//   },
// };

export default nextConfig;