import { useEffect, useState } from 'react';

function Sidebar({ currentPage }) {
  const navItems = [
    { href: "/", icon: "⚡", label: "Dashboard" },
    { href: "/bot-config", icon: "⚙️", label: "Bot Configuration" },
    { href: "/exports", icon: "🗄️", label: "Database Setup" },
    { href: "/webhook-status", icon: "🔗", label: "Webhook Status" },
    { href: "/approved", icon: "👥", label: "User Management" },
    { href: "/exports", icon: "📤", label: "File Storage" },
    { href: "/analytics", icon: "📊", label: "Analytics" },
    { href: "/error-logs", icon: "⚠️", label: "Error Logs" }
  ];

  return (
    <div style={{width:'250px', background:'white', borderRight:'1px solid var(--border)', minHeight:'100vh'}}>
      <div style={{padding:'24px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'32px'}}>
          <div style={{width:'32px', height:'32px', background:'var(--blue)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>
            C
          </div>
          <div>
            <div style={{fontWeight:'bold', color:'var(--text)'}}>CubaModel Bot</div>
            <div style={{fontSize:'12px', color:'var(--muted)'}}>Admin Dashboard</div>
          </div>
        </div>
        
        <nav style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              style={{
                display:'flex', 
                alignItems:'center', 
                gap:'12px', 
                padding:'12px 16px', 
                borderRadius:'12px', 
                background: currentPage === item.href ? 'var(--blue)' : 'transparent',
                color: currentPage === item.href ? 'white' : 'var(--muted)', 
                textDecoration:'none', 
                fontWeight:'600'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        
        <div style={{marginTop:'auto', paddingTop:'32px', position:'absolute', bottom:'24px'}}>
          <div style={{fontSize:'12px', color:'var(--muted)', display:'flex', alignItems:'center', justifyContent:'space-between', width:'200px'}}>
            <span>Bot Online</span>
            <span style={{color:'var(--blue)'}}>v2.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BotConfig() {
  const [config, setConfig] = useState({
    botToken: process.env.BOT_TOKEN ? '••••••••••••••••••••' : '',
    webhookUrl: '',
    adminIds: '',
    allowedChats: ''
  });
  const [status, setStatus] = useState({ webhook: false, bot: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
      setConfig(prev => ({
        ...prev,
        webhookUrl: data.webhook_url || window.location.origin + '/api/webhook'
      }));
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  const setupWebhook = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/run-setup');
      const data = await res.json();
      if (data.ok) {
        alert('Webhook configurado exitosamente!');
        fetchStatus();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error al configurar webhook: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'var(--bg)'}}>
      <Sidebar currentPage="/bot-config" />
      
      <div style={{flex:1}}>
        <header className="appbar">
          <div className="brand">
            <div className="logo"/>
            <div>
              <div>Bot Configuration</div>
              <div style={{fontSize:12,color:'#475569'}}>Manage your Telegram bot settings</div>
            </div>
          </div>
          <div className="actions">
            <button 
              className="btn green" 
              onClick={setupWebhook}
              disabled={loading}
            >
              {loading ? 'Configurando...' : 'Setup Webhook'}
            </button>
            <button className="btn gray" onClick={fetchStatus}>Refresh</button>
          </div>
        </header>
        
        <div className="container">
          <h1>Bot Configuration</h1>
          <div className="subtitle">Configure your Telegram bot settings and webhook</div>
          
          <div style={{display:'grid', gap:'24px', gridTemplateColumns:'1fr 1fr'}}>
            <div className="card">
              <h3>🤖 Bot Status</h3>
              <div className="row">
                <span>Bot Token:</span>
                <div className={status.bot ? 'badge ok' : 'badge err'}>
                  {status.bot ? 'Configured' : 'Missing'}
                </div>
              </div>
              <div className="row">
                <span>Webhook:</span>
                <div className={status.webhook ? 'badge ok' : 'badge err'}>
                  {status.webhook ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3>🔗 Webhook Configuration</h3>
              <div style={{marginBottom:'16px'}}>
                <label style={{fontSize:'14px', fontWeight:'600', color:'var(--text)'}}>
                  Webhook URL:
                </label>
                <input 
                  type="text"
                  value={config.webhookUrl}
                  readOnly
                  style={{
                    width:'100%',
                    padding:'8px 12px',
                    border:'1px solid var(--border)',
                    borderRadius:'8px',
                    marginTop:'4px',
                    background:'#f9fafb',
                    fontSize:'13px'
                  }}
                />
              </div>
              <button 
                className="btn blue"
                onClick={setupWebhook}
                disabled={loading}
                style={{width:'100%'}}
              >
                {loading ? 'Setting up...' : 'Configure Webhook'}
              </button>
            </div>
          </div>
          
          <div className="section card">
            <h3>🚀 Quick Deploy to Vercel</h3>
            <div className="subtitle">Deploy your bot and web panel to Vercel with one click</div>
            <div className="row">
              <div>
                <p style={{margin:'0 0 8px', fontSize:'14px'}}>
                  Ready to deploy your CubaModel Bot to production? This will:
                </p>
                <ul style={{margin:'0', paddingLeft:'20px', fontSize:'14px', color:'var(--muted)'}}>
                  <li>Deploy the web panel to Vercel</li>
                  <li>Configure environment variables</li>
                  <li>Set up the webhook automatically</li>
                  <li>Connect to your Supabase database</li>
                </ul>
              </div>
              <div style={{display:'flex', gap:'12px', flexDirection:'column', alignItems:'flex-end'}}>
                <a 
                  href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fcubamodel-bot" 
                  className="btn blue"
                  target="_blank"
                  rel="noreferrer"
                  style={{whiteSpace:'nowrap'}}
                >
                  🚀 Deploy to Vercel
                </a>
                <small style={{color:'var(--muted)', textAlign:'right'}}>
                  Make sure to add your environment variables in Vercel
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}