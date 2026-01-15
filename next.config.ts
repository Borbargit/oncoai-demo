import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Убираем экспериментальные настройки turbo
  // experimental: {
  //   turbo: {
  //     resolveAlias: {}
  //   }
  // }
};

export default nextConfig;
