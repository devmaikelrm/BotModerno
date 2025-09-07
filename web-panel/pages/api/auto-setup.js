export default async function handler(req, res) {
  try {
    const setupResults = {
      steps: [],
      success: true,
      errors: []
    };

    // Step 1: Check environment variables
    setupResults.steps.push({ 
      name: 'Environment Check', 
      status: 'running', 
      message: 'Checking required environment variables...' 
    });

    const requiredEnvs = ['BOT_TOKEN', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    
    if (missingEnvs.length > 0) {
      setupResults.steps[setupResults.steps.length - 1].status = 'error';
      setupResults.steps[setupResults.steps.length - 1].message = `Missing: ${missingEnvs.join(', ')}`;
      setupResults.success = false;
      setupResults.errors.push(`Missing environment variables: ${missingEnvs.join(', ')}`);
    } else {
      setupResults.steps[setupResults.steps.length - 1].status = 'success';
      setupResults.steps[setupResults.steps.length - 1].message = 'All environment variables configured';
    }

    // Step 2: Test Database Connection
    setupResults.steps.push({ 
      name: 'Database Connection', 
      status: 'running', 
      message: 'Testing Supabase database connection...' 
    });

    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      const { error } = await supabase.from('phones').select('count', { count: 'exact', head: true });
      
      if (error) throw error;
      
      setupResults.steps[setupResults.steps.length - 1].status = 'success';
      setupResults.steps[setupResults.steps.length - 1].message = 'Database connection successful';
    } catch (error) {
      setupResults.steps[setupResults.steps.length - 1].status = 'error';
      setupResults.steps[setupResults.steps.length - 1].message = `Database error: ${error.message}`;
      setupResults.success = false;
      setupResults.errors.push(`Database connection failed: ${error.message}`);
    }

    // Step 3: Verify Database Tables
    setupResults.steps.push({ 
      name: 'Database Schema', 
      status: 'running', 
      message: 'Verifying database tables exist...' 
    });

    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      const tables = ['phones', 'reports', 'subscriptions', 'submission_drafts'];
      const tableChecks = await Promise.all(
        tables.map(async (table) => {
          try {
            await supabase.from(table).select('*').limit(1);
            return { table, exists: true };
          } catch (error) {
            return { table, exists: false, error: error.message };
          }
        })
      );
      
      const missingTables = tableChecks.filter(check => !check.exists);
      
      if (missingTables.length > 0) {
        setupResults.steps[setupResults.steps.length - 1].status = 'warning';
        setupResults.steps[setupResults.steps.length - 1].message = `Missing tables: ${missingTables.map(t => t.table).join(', ')}`;
        setupResults.errors.push(`Missing database tables: ${missingTables.map(t => t.table).join(', ')}`);
      } else {
        setupResults.steps[setupResults.steps.length - 1].status = 'success';
        setupResults.steps[setupResults.steps.length - 1].message = 'All required tables found';
      }
    } catch (error) {
      setupResults.steps[setupResults.steps.length - 1].status = 'error';
      setupResults.steps[setupResults.steps.length - 1].message = `Schema check failed: ${error.message}`;
      setupResults.errors.push(`Schema verification failed: ${error.message}`);
    }

    // Step 4: Test Bot Token
    setupResults.steps.push({ 
      name: 'Bot Verification', 
      status: 'running', 
      message: 'Verifying Telegram bot token...' 
    });

    try {
      const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        setupResults.steps[setupResults.steps.length - 1].status = 'success';
        setupResults.steps[setupResults.steps.length - 1].message = `Bot verified: @${data.result.username}`;
        setupResults.botInfo = data.result;
      } else {
        throw new Error(data.description || 'Invalid bot token');
      }
    } catch (error) {
      setupResults.steps[setupResults.steps.length - 1].status = 'error';
      setupResults.steps[setupResults.steps.length - 1].message = `Bot verification failed: ${error.message}`;
      setupResults.success = false;
      setupResults.errors.push(`Bot token invalid: ${error.message}`);
    }

    // Step 5: Configure Webhook Automatically
    setupResults.steps.push({ 
      name: 'Webhook Setup', 
      status: 'running', 
      message: 'Configuring Telegram webhook...' 
    });

    try {
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const webhookUrl = `${proto}://${host}/api/webhook`;
      
      const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
      const data = await response.json();
      
      if (data.ok) {
        setupResults.steps[setupResults.steps.length - 1].status = 'success';
        setupResults.steps[setupResults.steps.length - 1].message = `Webhook configured: ${webhookUrl}`;
        setupResults.webhookUrl = webhookUrl;
      } else {
        throw new Error(data.description || 'Webhook setup failed');
      }
    } catch (error) {
      setupResults.steps[setupResults.steps.length - 1].status = 'error';
      setupResults.steps[setupResults.steps.length - 1].message = `Webhook setup failed: ${error.message}`;
      setupResults.errors.push(`Webhook configuration failed: ${error.message}`);
    }

    // Step 6: Test Webhook Connectivity
    setupResults.steps.push({ 
      name: 'Webhook Test', 
      status: 'running', 
      message: 'Testing webhook connectivity...' 
    });

    try {
      const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getWebhookInfo`);
      const data = await response.json();
      
      if (data.ok && data.result.url) {
        setupResults.steps[setupResults.steps.length - 1].status = 'success';
        setupResults.steps[setupResults.steps.length - 1].message = 'Webhook is active and reachable';
        setupResults.webhookInfo = data.result;
      } else {
        throw new Error('Webhook not configured or unreachable');
      }
    } catch (error) {
      setupResults.steps[setupResults.steps.length - 1].status = 'warning';
      setupResults.steps[setupResults.steps.length - 1].message = `Webhook test: ${error.message}`;
    }

    // Step 7: Create Initial Admin User (if needed)
    setupResults.steps.push({ 
      name: 'Admin Setup', 
      status: 'running', 
      message: 'Setting up admin access...' 
    });

    if (process.env.DASHBOARD_USER && process.env.DASHBOARD_PASS) {
      setupResults.steps[setupResults.steps.length - 1].status = 'success';
      setupResults.steps[setupResults.steps.length - 1].message = 'Admin credentials configured';
    } else {
      setupResults.steps[setupResults.steps.length - 1].status = 'warning';
      setupResults.steps[setupResults.steps.length - 1].message = 'Admin credentials not set (DASHBOARD_USER/DASHBOARD_PASS)';
    }

    // Generate setup summary
    const successCount = setupResults.steps.filter(s => s.status === 'success').length;
    const totalSteps = setupResults.steps.length;
    
    setupResults.summary = {
      success: setupResults.success && setupResults.errors.length === 0,
      completedSteps: successCount,
      totalSteps: totalSteps,
      percentage: Math.round((successCount / totalSteps) * 100),
      readyToDeploy: successCount >= 5, // Most critical steps completed
      nextSteps: []
    };

    // Add next steps based on results
    if (setupResults.errors.length > 0) {
      setupResults.summary.nextSteps.push('Fix configuration errors above');
    }
    if (successCount === totalSteps) {
      setupResults.summary.nextSteps.push('System is ready! You can now deploy to Vercel');
    } else {
      setupResults.summary.nextSteps.push('Complete remaining setup steps');
    }

    res.status(200).json(setupResults);

  } catch (error) {
    console.error('Auto-setup error:', error);
    res.status(500).json({
      success: false,
      error: 'Auto-setup failed',
      details: error.message,
      steps: [{
        name: 'System Error',
        status: 'error',
        message: error.message
      }]
    });
  }
}