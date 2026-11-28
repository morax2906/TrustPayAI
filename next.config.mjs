/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DEMO_PASSWORD: process.env.DEMO_PASSWORD ?? "Demo@12345",
  },
};

export default nextConfig;
