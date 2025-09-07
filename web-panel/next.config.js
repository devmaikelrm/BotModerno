module.exports = { 
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false
  },
  experimental: {
    serverComponentsExternalPackages: ['telegraf']
  },
  // Allow all hosts for Replit proxy compatibility
  async rewrites() {
    return []
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ]
  },
  // Allow all hosts for development in Replit
  async redirects() {
    return []
  },
  // Override the host check for development
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          ...config.watchOptions,
          ignored: ['**/node_modules/**', '**/.next/**']
        }
      }
      return config
    }
  })
};
