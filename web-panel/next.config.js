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
  }
};
