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

export default function WebhookStatus() {
  const [webhookInfo, setWebhookInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchWebhookInfo();
    const interval = setInterval(fetchWebhookInfo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchWebhookInfo = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setWebhookInfo(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching webhook info:', error);
    }
    setLoading(false);
  };

  const testWebhook = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/run-setup');
      const data = await res.json();
      alert(data.message);
      fetchWebhookInfo();
    } catch (error) {
      alert('Error testing webhook: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'var(--bg)'}}>
      <Sidebar currentPage="/webhook-status" />
      
      <div style={{flex:1}}>
        <header className="appbar">
          <div className="brand">
            <div className="logo"/>
            <div>
              <div>Webhook Status</div>
              <div style={{fontSize:12,color:'#475569'}}>Monitor webhook connectivity and performance</div>
            </div>
          </div>
          <div className="actions">
            <button 
              className="btn green" 
              onClick={testWebhook}
              disabled={loading}
            >
              Test Webhook
            </button>
            <button className="btn gray" onClick={fetchWebhookInfo}>Refresh</button>
          </div>
        </header>
        
        <div className="container">
          <h1>Webhook Status</h1>
          <div className="subtitle">Monitor your Telegram webhook connectivity</div>
          
          <div style={{display:'grid', gap:'24px', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))'}}>
            <div className="card">
              <h3>🔗 Webhook Status</h3>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <div className="row">
                    <span>Status:</span>
                    <div className={webhookInfo?.webhook ? 'badge ok' : 'badge err'}>
                      {webhookInfo?.webhook ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="row">
                    <span>Bot Token:</span>
                    <div className={webhookInfo?.bot ? 'badge ok' : 'badge err'}>
                      {webhookInfo?.bot ? 'Valid' : 'Invalid'}
                    </div>
                  </div>
                  <div className="row">
                    <span>Last Check:</span>
                    <small className="subtitle">{lastUpdate.toLocaleString()}</small>
                  </div>
                </>
              )}
            </div>
            
            <div className="card">
              <h3>🌐 Webhook URL</h3>
              <div style={{wordBreak:'break-all', fontSize:'13px', color:'var(--muted)', marginBottom:'12px'}}>
                {typeof window !== 'undefined' ? window.location.origin : '[domain]'}/api/webhook
              </div>
              <div className="row">
                <span>Protocol:</span>
                <div className="badge ok">HTTPS</div>
              </div>
              <div className="row">
                <span>Method:</span>
                <div className="badge ok">POST</div>
              </div>
            </div>
            
            <div className="card">
              <h3>📊 Performance</h3>
              <div className="row">
                <span>Response Time:</span>
                <span className="subtitle">&lt; 100ms</span>
              </div>
              <div className="row">
                <span>Uptime:</span>
                <div className="badge ok">99.9%</div>
              </div>
              <div className="row">
                <span>Last Error:</span>
                <span className="subtitle">None</span>
              </div>
            </div>
          </div>
          
          <div className="section card">
            <h3>🔧 Webhook Configuration</h3>
            <div className="subtitle">Telegram webhook settings and diagnostics</div>
            
            <div style={{display:'grid', gap:'16px', gridTemplateColumns:'1fr 1fr'}}>
              <div>
                <h4 style={{margin:'0 0 8px', fontSize:'14px', fontWeight:'600'}}>Current Configuration</h4>
                <div className="progress">
                  <div className="pill">Max Connections: 40</div>
                  <div className="pill">Allowed Updates: All</div>
                  <div className="pill">Drop Pending: False</div>
                </div>
              </div>
              
              <div>
                <h4 style={{margin:'0 0 8px', fontSize:'14px', fontWeight:'600'}}>Quick Actions</h4>
                <div style={{display:'flex', gap:'8px', flexDirection:'column'}}>
                  <button 
                    className="btn blue"
                    onClick={testWebhook}
                    style={{fontSize:'13px', padding:'6px 12px'}}
                  >
                    Reconfigure Webhook
                  </button>
                  <button 
                    className="btn gray"
                    onClick={() => window.open('/api/webhook', '_blank')}
                    style={{fontSize:'13px', padding:'6px 12px'}}
                  >
                    Test Endpoint
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}