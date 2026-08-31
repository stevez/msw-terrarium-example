import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default (phase: string, { defaultConfig }: { defaultConfig: NextConfig }) => {
  const isE2EMode = process.env.E2E_MODE === 'true';

  const nextConfig: NextConfig = {
    ...defaultConfig,
    productionBrowserSourceMaps: isE2EMode,
    experimental: {
      optimizePackageImports: ['react-icons'],
    },
    webpack: (config, { isServer, dev }) => {
      if (isE2EMode) {
        if (dev) {
          // In dev mode, use Object.defineProperty to prevent Next.js from overriding devtool
          Object.defineProperty(config, 'devtool', {
            get() {
              return 'source-map';
            },
            set() {
              // Ignore attempts to override
            },
          });
        } else {
          config.devtool = 'source-map';
        }

        config.optimization = {
          ...config.optimization,
          minimize: false,
        };

        // For server-side, output source maps alongside the bundles
        if (isServer) {
          config.output = {
            ...config.output,
            devtoolModuleFilenameTemplate: '[absolute-resource-path]',
          };
        }
      }
      return config;
    },
  };
  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    return { ...nextConfig, distDir: 'dist' };
  }

  return nextConfig;
};
