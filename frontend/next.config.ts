import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos enviadas pelo /admin ficam no Supabase Storage (bucket público "media").
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
