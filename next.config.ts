import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eu-central-1-shared-euc1-02.graphassets.com",
        pathname: "/**",
      },
    ],
  },
  // Allow Hygraph Studio Live Preview to embed the site in an iframe.
  // @see https://hygraph.com/docs/developer-guides/schema/live-preview#csp-or-security-header-issues
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.hygraph.com https://hygraph.com https://app.hygraph.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
