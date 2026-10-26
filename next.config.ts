import type { NextConfig } from "next";
import { invitations } from "./src/lib/invitations";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Links that were shared before URLs used names (/invite/001) keep working.
  async redirects() {
    return invitations
      .filter((invitation) => invitation.id !== invitation.slug)
      .map((invitation) => ({ source: `/invite/${invitation.id}`, destination: `/invite/${invitation.slug}`, permanent: true }));
  },
};

export default nextConfig;
