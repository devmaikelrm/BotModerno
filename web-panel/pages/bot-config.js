import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

// Use shared Sidebar component for consistent layout

export default function BotConfig() {
  const [config, setConfig] = useState({
    botToken: '',
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
      
      // Actualizar el estado basado en la respuesta de la API
      setStatus({
        bot: data.bot?.hasBotToken || false,
        webhook: data.bot?.webhookSet || false
      });
      
      setConfig(prev => ({
        ...prev,
        botToken: data.bot?.hasBotToken ? '••••••••••••••••••••' : '',
        webhookUrl: data.bot?.webhookUrl || window.location.origin + '/api/webhook'
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
        showToast('Webhook configurado exitosamente!', { type: 'success' });
        fetchStatus();
      } else {
        showToast('Error: ' + data.message, { type: 'error' });
      }
    } catch (error) {
      showToast('Error al configurar webhook: ' + error.message, { type: 'error' });
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
    <div className="app-container">
      <Sidebar currentPage="bot-config" />

      <main className="main-content">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Bot Configuration</h1>
              <p className="page-subtitle">Manage your Telegram bot settings</p>
            </div>
            <div className="header-actions">
              <button 
                className="btn green" 
                onClick={setupWebhook}
                disabled={loading}
              >
                {loading ? 'Configurando...' : 'Setup Webhook'}
              </button>
              <button className="btn gray" onClick={fetchStatus}>Refresh</button>
            </div>
          </div>
        </div>

        <div className="page-content">
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
      </main>
    </div>
  );
}