/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove powered by header for security and cleaner response
  poweredByHeader: false,
  
  // Enable compression
  compress: true,
  
  // Disable trailing slash for cleaner URLs
  trailingSlash: false,
  
  // Enable image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Performance optimizations
  experimental: {
    // Enable CSS optimization
    optimizeCss: true,
    
    // Enable modern JavaScript output for better performance
    modern: true,
    
    // Enable concurrent features
    concurrentFeatures: true,
    
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      'react-syntax-highlighter',
      'react-markdown'
    ],
    
    // Enable turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  },
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    
    // Enable React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
      
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Minimize bundle size
      config.optimization.minimize = true;
    }
    
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/rss.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/rss+xml; charset=utf-8',
          },
        ],
      },
      {
        source: '/feed.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/blog/',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
  
  // Rewrites for better URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  
  // Environment variables
  env: {
    // Add any environment variables here
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://rikjimue.com',
  },
  
  // Enable static optimization
  trailingSlash: false,
  
  // Production source maps for debugging (disable for better performance)
  productionBrowserSourceMaps: false,
  
  // React strict mode for better debugging
  reactStrictMode: true,
  
  // TypeScript configuration
  typescript: {
    // Only run type checking in development
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // ESLint configuration
  eslint: {
    // Only run ESLint in development
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // Output configuration for static hosting
  output: 'standalone',
  
  // Enable experimental features for better performance
  experimental: {
    // Enable app directory
    appDir: true,
    
    // Enable server components
    serverComponents: true,
    
    // Enable runtime configuration
    runtime: 'nodejs',
    
    // Enable edge runtime for better performance where possible
    serverComponentsExternalPackages: [
      'gray-matter',
      'react-syntax-highlighter'
    ],
  },
};


