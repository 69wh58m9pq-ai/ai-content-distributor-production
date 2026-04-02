import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 禁用全局错误页面构建
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;