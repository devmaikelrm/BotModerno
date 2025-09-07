export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { repoUrl, projectName } = req.body;

    // Validate required fields
    if (!repoUrl || !projectName) {
      return res.status(400).json({ 
        error: 'Missing required fields: repoUrl and projectName are required' 
      });
    }

    // Generate Vercel deployment URL with environment variables preset
    const vercelDeployUrl = new URL('https://vercel.com/new/git/external');
    vercelDeployUrl.searchParams.set('repository-url', repoUrl);
    vercelDeployUrl.searchParams.set('project-name', projectName);
    
    // Add environment variable suggestions
    const envVars = {
      'BOT_TOKEN': 'Your Telegram bot token from BotFather',
      'SUPABASE_URL': 'Your Supabase project URL',
      'SUPABASE_SERVICE_ROLE_KEY': 'Your Supabase service role key',
      'DASHBOARD_USER': 'Admin username for the dashboard',
      'DASHBOARD_PASS': 'Secure password for dashboard access'
    };

    // Instructions for the user
    const deploymentInstructions = {
      step1: 'Click the deployment link below',
      step2: 'Connect your GitHub repository to Vercel',
      step3: 'Configure environment variables in Vercel dashboard',
      step4: 'Deploy and get your production URL',
      step5: 'Set up Telegram webhook with your production URL'
    };

    res.status(200).json({
      success: true,
      deployUrl: vercelDeployUrl.toString(),
      envVars,
      instructions: deploymentInstructions,
      webhookUrl: '(Your Vercel URL)/api/webhook'
    });

  } catch (error) {
    console.error('Vercel deployment preparation error:', error);
    res.status(500).json({ 
      error: 'Failed to prepare Vercel deployment',
      details: error.message 
    });
  }
}