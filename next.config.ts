import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// PWA initialization logic
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development", 
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* Existing config options here */
};


export default withPWA(nextConfig);