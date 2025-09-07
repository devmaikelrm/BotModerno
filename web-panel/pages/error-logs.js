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

export default function ErrorLogs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Sample error logs - in a real app, these would come from your logging system
  const sampleLogs = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      level: 'error',
      message: 'Database connection timeout',
      source: 'supabase-client',
      details: 'Connection to Supabase failed after 30 seconds'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      level: 'warning',
      message: 'Webhook delivery failed, retrying...',
      source: 'telegram-api',
      details: 'HTTP 503 Service Unavailable from Telegram'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      level: 'error',
      message: 'Invalid user input in wizard',
      source: 'bot-wizard',
      details: 'User submitted malformed phone model data'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      level: 'info',
      message: 'Successfully processed phone submission',
      source: 'bot-wizard',
      details: 'Phone Samsung Galaxy S21 added to pending review'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      level: 'warning',
      message: 'Rate limit approaching for user',
      source: 'middleware',
      details: 'User 123456789 has made 8/10 requests in the last minute'
    }
  ];

  useEffect(() => {
    setLogs(sampleLogs);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const clearLogs = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todos los logs?')) {
      setLogs([]);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return '#dc2626';
      case 'warning': return '#d97706';
      case 'info': return '#2563eb';
      default: return 'var(--muted)';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'var(--bg)'}}>
      <Sidebar currentPage="/error-logs" />
      
      <div style={{flex:1}}>
        <header className="appbar">
          <div className="brand">
            <div className="logo"/>
            <div>
              <div>Error Logs</div>
              <div style={{fontSize:12,color:'#475569'}}>System logs and error monitoring</div>
            </div>
          </div>
          <div className="actions">
            <select 
              className="btn gray"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{padding:'8px 12px', border:'1px solid var(--border)', borderRadius:'10px'}}
            >
              <option value="all">All Logs</option>
              <option value="error">Errors Only</option>
              <option value="warning">Warnings Only</option>
              <option value="info">Info Only</option>
            </select>
            <button className="btn gray" onClick={clearLogs}>Clear Logs</button>
            <button className="btn gray" onClick={() => setLogs(sampleLogs)}>Refresh</button>
          </div>
        </header>
        
        <div className="container">
          <h1>System Error Logs</h1>
          <div className="subtitle">Monitor system errors, warnings, and debug information</div>
          
          <div style={{display:'grid', gap:'24px', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', marginBottom:'24px'}}>
            <div className="card">
              <h3>🔴 Errors</h3>
              <div className="kpi">
                <strong style={{color:'#dc2626'}}>{logs.filter(l => l.level === 'error').length}</strong>
                <span className="subtitle">last 24h</span>
              </div>
            </div>
            <div className="card">
              <h3>🟡 Warnings</h3>
              <div className="kpi">
                <strong style={{color:'#d97706'}}>{logs.filter(l => l.level === 'warning').length}</strong>
                <span className="subtitle">last 24h</span>
              </div>
            </div>
            <div className="card">
              <h3>🔵 Info</h3>
              <div className="kpi">
                <strong style={{color:'#2563eb'}}>{logs.filter(l => l.level === 'info').length}</strong>
                <span className="subtitle">last 24h</span>
              </div>
            </div>
            <div className="card">
              <h3>📊 Total</h3>
              <div className="kpi">
                <strong style={{color:'var(--text)'}}>{logs.length}</strong>
                <span className="subtitle">all logs</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3>📋 Recent Logs</h3>
            <div className="subtitle">System events and error messages ({filteredLogs.length} entries)</div>
            
            {filteredLogs.length === 0 ? (
              <div style={{textAlign:'center', padding:'40px', color:'var(--muted)'}}>
                <div style={{fontSize:'48px', opacity:0.3}}>📝</div>
                <div>No logs found</div>
                <div style={{fontSize:'12px'}}>
                  {filter === 'all' ? 'System is running smoothly!' : `No ${filter} logs to display`}
                </div>
              </div>
            ) : (
              <div style={{marginTop:'20px'}}>
                {filteredLogs.map((log, index) => (
                  <div 
                    key={log.id}
                    style={{
                      padding:'16px',
                      borderBottom: index < filteredLogs.length - 1 ? '1px solid var(--border)' : 'none',
                      display:'flex',
                      alignItems:'flex-start',
                      gap:'12px'
                    }}
                  >
                    <div style={{fontSize:'20px'}}>{getLevelIcon(log.level)}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px'}}>
                        <div style={{fontWeight:'600', color:getLevelColor(log.level)}}>{log.message}</div>
                        <small style={{color:'var(--muted)'}}>{log.timestamp.toLocaleString()}</small>
                      </div>
                      <div style={{fontSize:'13px', color:'var(--muted)', marginBottom:'4px'}}>
                        Source: {log.source}
                      </div>
                      {log.details && (
                        <div style={{fontSize:'12px', color:'var(--muted)', fontFamily:'monospace', background:'#f9fafb', padding:'8px', borderRadius:'4px'}}>
                          {log.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="section card">
            <h3>🔧 Log Configuration</h3>
            <div className="subtitle">Manage logging levels and retention settings</div>
            
            <div style={{display:'grid', gap:'16px', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', marginTop:'16px'}}>
              <div>
                <h4 style={{margin:'0 0 8px', fontSize:'14px', fontWeight:'600'}}>Log Levels</h4>
                <div className="progress">
                  <div className="pill">Error: Enabled</div>
                  <div className="pill">Warning: Enabled</div>
                  <div className="pill">Info: Enabled</div>
                  <div className="pill">Debug: Disabled</div>
                </div>
              </div>
              
              <div>
                <h4 style={{margin:'0 0 8px', fontSize:'14px', fontWeight:'600'}}>Retention</h4>
                <div className="progress">
                  <div className="pill">Keep logs: 30 days</div>
                  <div className="pill">Max size: 100MB</div>
                  <div className="pill">Auto-cleanup: On</div>
                </div>
              </div>
              
              <div>
                <h4 style={{margin:'0 0 8px', fontSize:'14px', fontWeight:'600'}}>Export Options</h4>
                <div style={{display:'flex', gap:'8px', flexDirection:'column'}}>
                  <button className="btn blue" style={{fontSize:'13px', padding:'6px 12px'}}>
                    📄 Export as CSV
                  </button>
                  <button className="btn gray" style={{fontSize:'13px', padding:'6px 12px'}}>
                    📊 Generate Report
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