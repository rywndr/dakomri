import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,

    async rewrites() {
        return [
            {
                source: "/admin",
                destination: "/admin/submissions",
            },
        ];
    },
};

export default nextConfig;
