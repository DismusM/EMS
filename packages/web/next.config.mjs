/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ems/ui', '@ems/user-management', '@ems/equipment-asset-management'],
};

export default nextConfig;
