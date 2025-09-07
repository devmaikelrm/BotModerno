export default async function handler(req, res) {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {},
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    // Check Bot Token
    if (process.env.BOT_TOKEN) {
      try {
        const botResponse = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getMe`);
        const botData = await botResponse.json();
        
        healthStatus.services.bot = {
          status: botData.ok ? 'healthy' : 'unhealthy',
          details: botData.ok ? `@${botData.result.username}` : botData.description,
          lastCheck: new Date().toISOString()
        };
      } catch (error) {
        healthStatus.services.bot = {
          status: 'unhealthy',
          details: error.message,
          lastCheck: new Date().toISOString()
        };
      }
    } else {
      healthStatus.services.bot = {
        status: 'unhealthy',
        details: 'BOT_TOKEN not configured',
        lastCheck: new Date().toISOString()
      };
    }

    // Check Database Connection
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        
        const { error } = await supabase.from('phones').select('count', { count: 'exact', head: true });
        
        healthStatus.services.database = {
          status: error ? 'unhealthy' : 'healthy',
          details: error ? error.message : 'Connection successful',
          lastCheck: new Date().toISOString()
        };
      } catch (error) {
        healthStatus.services.database = {
          status: 'unhealthy',
          details: error.message,
          lastCheck: new Date().toISOString()
        };
      }
    } else {
      healthStatus.services.database = {
        status: 'unhealthy',
        details: 'Database credentials not configured',
        lastCheck: new Date().toISOString()
      };
    }

    // Check Webhook Status
    if (process.env.BOT_TOKEN) {
      try {
        const webhookResponse = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getWebhookInfo`);
        const webhookData = await webhookResponse.json();
        
        healthStatus.services.webhook = {
          status: webhookData.ok && webhookData.result.url ? 'healthy' : 'unhealthy',
          details: webhookData.ok ? 
            (webhookData.result.url ? `Active: ${webhookData.result.url}` : 'Not configured') :
            webhookData.description,
          lastCheck: new Date().toISOString(),
          url: webhookData.result?.url
        };
      } catch (error) {
        healthStatus.services.webhook = {
          status: 'unhealthy',
          details: error.message,
          lastCheck: new Date().toISOString()
        };
      }
    } else {
      healthStatus.services.webhook = {
        status: 'unhealthy',
        details: 'BOT_TOKEN required for webhook check',
        lastCheck: new Date().toISOString()
      };
    }

    // Check Admin Dashboard
    healthStatus.services.dashboard = {
      status: (process.env.DASHBOARD_USER && process.env.DASHBOARD_PASS) ? 'healthy' : 'warning',
      details: (process.env.DASHBOARD_USER && process.env.DASHBOARD_PASS) ? 
        'Admin credentials configured' : 
        'Admin credentials not set',
      lastCheck: new Date().toISOString()
    };

    // Determine overall health
    const unhealthyServices = Object.values(healthStatus.services).filter(s => s.status === 'unhealthy');
    const warningServices = Object.values(healthStatus.services).filter(s => s.status === 'warning');
    
    if (unhealthyServices.length > 0) {
      healthStatus.status = 'unhealthy';
    } else if (warningServices.length > 0) {
      healthStatus.status = 'warning';
    }

    // Add summary
    healthStatus.summary = {
      healthy: Object.values(healthStatus.services).filter(s => s.status === 'healthy').length,
      warning: warningServices.length,
      unhealthy: unhealthyServices.length,
      total: Object.keys(healthStatus.services).length
    };

    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'warning' ? 200 : 503;

    res.status(statusCode).json(healthStatus);

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}