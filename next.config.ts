import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH;
const isGitHubPagesBuild = pagesBasePath !== undefined;

const nextConfig: NextConfig = {
  output: isGitHubPagesBuild ? "export" : undefined,
  basePath: pagesBasePath,
  trailingSlash: isGitHubPagesBuild ? true : undefined,
  images: isGitHubPagesBuild ? { unoptimized: true } : undefined,
  typescript: {
    tsconfigPath: isGitHubPagesBuild ? "tsconfig.pages.json" : "tsconfig.json",
  },
};

export default nextConfig;
