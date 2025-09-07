module.exports = { 
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false
  },
  experimental: {
    serverComponentsExternalPackages: ['telegraf']
  },
  
  // Configuración para Cloudflare Pages
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true // Necesario para exportación estática
  },
  
  // Allow all hosts for development
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
