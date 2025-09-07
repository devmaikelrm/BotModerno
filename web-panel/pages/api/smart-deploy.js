export default async function handler(req, res) {
  try {
    const { repoUrl, branch = 'main' } = req.body;

    // Auto-detect current environment
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('replit');

    // Environment variables with smart defaults
    const environmentVariables = {
      BOT_TOKEN: {
        required: true,
        description: 'Your Telegram bot token from @BotFather',
        example: '1234567890:AAHdqTcvbXorGzw5P4M-example',
        value: process.env.BOT_TOKEN ? 'CONFIGURED' : 'REQUIRED'
      },
      SUPABASE_URL: {
        required: true,
        description: 'Your Supabase project URL',
        example: 'https://your-project.supabase.co',
        value: process.env.SUPABASE_URL ? 'CONFIGURED' : 'REQUIRED'
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        required: true,
        description: 'Your Supabase service role key (secret)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        value: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'CONFIGURED' : 'REQUIRED'
      },
      DASHBOARD_USER: {
        required: true,
        description: 'Username for admin dashboard access',
        example: 'admin',
        default: 'admin',
        value: process.env.DASHBOARD_USER || 'admin'
      },
      DASHBOARD_PASS: {
        required: true,
        description: 'Secure password for admin dashboard',
        example: 'SecurePassword123!',
        generate: true,
        value: process.env.DASHBOARD_PASS ? 'CONFIGURED' : generatePassword()
      },
      NODE_ENV: {
        required: false,
        description: 'Environment mode',
        default: 'production',
        value: 'production'
      },
      VERCEL: {
        required: false,
        description: 'Vercel deployment flag',
        default: '1',
        value: '1'
      }
    };

    // Generate optimized deployment configuration
    const deployConfig = {
      // Auto-detect project type
      framework: 'nextjs',
      buildCommand: 'npm run build',
      outputDirectory: '.next',
      installCommand: 'npm install',
      
      // Environment variables with smart defaults
      environmentVariables,

      // Vercel-specific optimizations
      vercelConfig: {
        version: 2,
        builds: [
          {
            src: 'web-panel/package.json',
            use: '@vercel/next'
          }
        ],
        routes: [
          {
            src: '/api/(.*)',
            dest: '/web-panel/pages/api/$1'
          },
          {
            src: '/(.*)',
            dest: '/web-panel/$1'
          }
        ],
        env: {
          ...Object.fromEntries(
            Object.entries(environmentVariables)
              .filter(([key, config]) => config.value && config.value !== 'REQUIRED')
              .map(([key, config]) => [key, config.value])
          )
        }
      },

      // Auto-generated deployment script
      deployScript: generateDeployScript(),

      // Post-deployment setup
      postDeploy: {
        webhookSetup: true,
        databaseMigration: false, // Tables should exist
        healthCheck: true
      }
    };

    // Generate Vercel Deploy Button URL with all parameters
    const vercelDeployUrl = new URL('https://vercel.com/new/clone');
    const params = new URLSearchParams({
      'repository-url': repoUrl || `https://github.com/your-username/cubamodel-bot`,
      'project-name': 'cubamodel-bot',
      'framework': 'nextjs',
      'root-directory': 'web-panel',
      'build-command': 'npm run build',
      'output-directory': '.next',
      'install-command': 'npm install'
    });

    // Add environment variables as URL params
    Object.entries(deployConfig.environmentVariables).forEach(([key, config]) => {
      if (config.required) {
        params.append('env', key);
        params.append(`env-description-${key}`, config.description);
        if (config.default && config.value !== 'REQUIRED') {
          params.append(`env-default-${key}`, config.default);
        }
      }
    });

    vercelDeployUrl.search = params.toString();

    // Generate setup instructions
    const setupInstructions = [
      {
        step: 1,
        title: 'Clone & Deploy',
        description: 'Click the deploy button to clone and deploy to Vercel',
        action: 'Deploy to Vercel',
        url: vercelDeployUrl.toString()
      },
      {
        step: 2,
        title: 'Configure Environment',
        description: 'Add your environment variables in Vercel dashboard',
        variables: Object.entries(deployConfig.environmentVariables)
          .filter(([key, config]) => config.required)
          .map(([key, config]) => ({
            name: key,
            description: config.description,
            example: config.example,
            required: config.required
          }))
      },
      {
        step: 3,
        title: 'Auto-Setup',
        description: 'Your bot will automatically configure after deployment',
        features: [
          'Webhook will be set automatically',
          'Database connection will be tested', 
          'Bot will be verified and activated',
          'Admin dashboard will be secured'
        ]
      },
      {
        step: 4,
        title: 'Go Live!',
        description: 'Your CubaModel Bot will be ready to use',
        finalSteps: [
          'Share your bot link with users',
          'Access admin panel at your-domain.vercel.app',
          'Monitor submissions and moderate content'
        ]
      }
    ];

    res.status(200).json({
      success: true,
      config: deployConfig,
      deployUrl: vercelDeployUrl.toString(),
      instructions: setupInstructions,
      estimatedDeployTime: '3-5 minutes',
      autoConfigured: true
    });

  } catch (error) {
    console.error('Smart deploy error:', error);
    res.status(500).json({
      success: false,
      error: 'Smart deployment preparation failed',
      details: error.message
    });
  }
}

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateDeployScript() {
  return {
    name: 'CubaModel Bot Auto-Deploy',
    description: 'Automated deployment script for Vercel',
    steps: [
      'npm install',
      'npm run build',
      'Setup environment variables',
      'Configure Telegram webhook',
      'Test database connection',
      'Initialize admin dashboard',
      'Deploy to production'
    ]
  };
}