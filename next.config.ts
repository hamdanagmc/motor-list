import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: { loader: "custom", loaderFile: "./lib/sanity/image-loader.ts" },
  // Logged-out visitors are then bounced to /login by proxy.ts.
  redirects: async () => [{ source: "/", destination: "/vehicle-stock", permanent: false }],
  // Internal portal: keep every response out of search engines, including non-HTML ones.
  headers: async () => [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }],
};

export default nextConfig;
