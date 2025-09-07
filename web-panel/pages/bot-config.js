import { useEffect, useState } from 'react';

function Sidebar({ currentPage = 'bot-config' }) {
  const menuItems = [
    { icon: '⚡', label: 'Dashboard', href: '/', id: 'dashboard' },
    { icon: '🤖', label: 'Bot Config', href: '/bot-config', id: 'bot-config' },
    { icon: '📱', label: 'Phones', href: '/admin/phones', id: 'database' },
    { icon: '🔗', label: 'Webhook', href: '/webhook-status', id: 'webhook' },
    { icon: '👥', label: 'Users', href: '/approved', id: 'users' },
    { icon: '📊', label: 'Analytics', href: '/analytics', id: 'analytics' },
    { icon: '📤', label: 'Exports', href: '/exports', id: 'exports' },
    { icon: '📋', label: 'Reports', href: '/reports', id: 'reports' }
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 min-h-screen shadow-sm">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            C
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">CubaModel Bot</div>
            <div className="text-sm text-gray-500">Admin Dashboard</div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                currentPage === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {currentPage !== item.id && (
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              )}
            </a>
          ))}
        </nav>
        
        {/* Status */}
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">Status</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700">Online</span>
            </div>
          </div>
          <div className="text-xs text-green-600 mt-1">v2.1.0</div>
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
  const [autoSetupResults, setAutoSetupResults] = useState(null);
  const [isAutoSetupRunning, setIsAutoSetupRunning] = useState(false);

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

  const runAutoSetup = async () => {
    setIsAutoSetupRunning(true);
    setAutoSetupResults(null);
    
    try {
      const res = await fetch('/api/auto-setup');
      const data = await res.json();
      setAutoSetupResults(data);
      
      if (data.success) {
        alert('🎉 ¡Configuración automática completada exitosamente!');
        fetchStatus();
      } else {
        alert('⚠️ Configuración completada con algunos problemas. Revisa los detalles.');
      }
    } catch (error) {
      setAutoSetupResults({
        success: false,
        error: 'Auto-setup failed',
        details: error.message
      });
      alert('Error en configuración automática: ' + error.message);
    }
    
    setIsAutoSetupRunning(false);
  };

  const deployToVercel = async () => {
    try {
      const res = await fetch('/api/smart-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: 'https://github.com/your-username/cubamodel-bot'
        })
      });
      const data = await res.json();
      
      if (data.success) {
        window.open(data.deployUrl, '_blank');
      } else {
        alert('Error al preparar deployment: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar currentPage="bot-config" />
      
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
            <h3>⚡ Configuración Automática</h3>
            <div className="subtitle">Configura todo automáticamente con un solo click</div>
            
            <div style={{display:'grid', gap:'16px', gridTemplateColumns:'1fr 1fr'}}>
              <div>
                <h4 style={{margin:'0 0 12px', fontSize:'15px', fontWeight:'600'}}>🤖 Setup Automático</h4>
                <div style={{marginBottom:'16px'}}>
                  <p style={{margin:'0 0 8px', fontSize:'14px'}}>
                    Configura automáticamente:
                  </p>
                  <ul style={{margin:'0', paddingLeft:'20px', fontSize:'13px', color:'var(--muted)'}}>
                    <li>Verifica variables de entorno</li>
                    <li>Conecta y prueba la base de datos</li>
                    <li>Valida el token del bot</li>
                    <li>Configura webhook automáticamente</li>
                    <li>Prepara dashboard de admin</li>
                  </ul>
                </div>
                <button 
                  className="btn green"
                  onClick={runAutoSetup}
                  disabled={isAutoSetupRunning}
                  style={{width:'100%'}}
                >
                  {isAutoSetupRunning ? '⏳ Configurando...' : '⚡ Auto-Setup Completo'}
                </button>
              </div>
              
              <div>
                <h4 style={{margin:'0 0 12px', fontSize:'15px', fontWeight:'600'}}>🚀 Deploy Inteligente</h4>
                <div style={{marginBottom:'16px'}}>
                  <p style={{margin:'0 0 8px', fontSize:'14px'}}>
                    Deploy optimizado que incluye:
                  </p>
                  <ul style={{margin:'0', paddingLeft:'20px', fontSize:'13px', color:'var(--muted)'}}>
                    <li>Variables pre-configuradas</li>
                    <li>Deploy automático a Vercel</li>
                    <li>Configuración post-deploy</li>
                    <li>Webhook automático</li>
                    <li>Monitoreo incluido</li>
                  </ul>
                </div>
                <button 
                  className="btn blue"
                  onClick={deployToVercel}
                  style={{width:'100%'}}
                >
                  🚀 Smart Deploy to Vercel
                </button>
              </div>
            </div>
          </div>
          
          {autoSetupResults && (
            <div className="section card">
              <h3>📋 Resultados de Configuración</h3>
              <div className="subtitle">Estado del setup automático</div>
              
              <div style={{marginTop:'16px'}}>
                {autoSetupResults.summary && (
                  <div style={{
                    padding:'16px', 
                    background: autoSetupResults.summary.success ? '#dcfce7' : '#fef3c7',
                    borderRadius:'12px',
                    marginBottom:'16px'
                  }}>
                    <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                      <span style={{fontSize:'24px'}}>
                        {autoSetupResults.summary.success ? '🎉' : '⚠️'}
                      </span>
                      <div>
                        <div style={{fontWeight:'600', fontSize:'16px'}}>
                          {autoSetupResults.summary.success ? '¡Configuración Completada!' : 'Configuración con Problemas'}
                        </div>
                        <div style={{fontSize:'14px', color:'var(--muted)'}}>
                          {autoSetupResults.summary.completedSteps}/{autoSetupResults.summary.totalSteps} pasos completados 
                          ({autoSetupResults.summary.percentage}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div style={{display:'grid', gap:'8px'}}>
                  {autoSetupResults.steps?.map((step, index) => (
                    <div key={index} style={{
                      display:'flex',
                      alignItems:'center',
                      gap:'12px',
                      padding:'12px',
                      background:'#f9fafb',
                      borderRadius:'8px',
                      border:'1px solid var(--border)'
                    }}>
                      <span style={{fontSize:'18px'}}>
                        {step.status === 'success' ? '✅' : step.status === 'error' ? '❌' : step.status === 'warning' ? '⚠️' : '⏳'}
                      </span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:'600', fontSize:'14px'}}>{step.name}</div>
                        <div style={{fontSize:'13px', color:'var(--muted)'}}>{step.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {autoSetupResults.summary?.nextSteps && (
                  <div style={{marginTop:'16px'}}>
                    <h4 style={{margin:'0 0 8px', fontSize:'14px', fontWeight:'600'}}>Próximos Pasos:</h4>
                    <ul style={{margin:'0', paddingLeft:'20px', fontSize:'13px', color:'var(--muted)'}}>
                      {autoSetupResults.summary.nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}