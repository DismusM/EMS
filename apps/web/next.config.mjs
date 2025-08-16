import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ESM-friendly require
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ems/user-management', '@ems/shared', '@ems/ui'],
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  webpack: (config) => {
    // Configure path aliases
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Use exact-match aliases to avoid intercepting subpath imports like
      // '@mantine/core/styles.css'
      '@mantine/core$': require.resolve('@mantine/core'),
      '@mantine/hooks$': require.resolve('@mantine/hooks'),
      // Add @/ alias to point to root directory
      '@': __dirname,
    };
    
    return config;
  },
};

export default nextConfig;
