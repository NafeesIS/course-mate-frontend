/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/company/:name/:cin',
        missing: [
          {
            type: 'query',
            key: 'tab',
          },
        ],
        destination: '/company/:name/:cin?tab=about',
        permanent: true,
      },
      {
        source: '/cancellation-policy',
        destination: '/refund-policy',
        permanent: true,
      },
    ];
  },
  // time in seconds of no pages generating during static
  // generation before timing out
  staticPageGenerationTimeout: 180,
  logging: {
    level: 'verbose',
    fullUrl: true,
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      '@headlessui/react',
      '@headlessui-float/react',
      'recharts',
      'react-icons/*',
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'INP', 'FCP'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'filesurestorage.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const configWithBundleAnalyzer =
  process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig;

export default configWithBundleAnalyzer;
