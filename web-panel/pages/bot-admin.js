import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function BotAdmin() {
  const [rules, setRules] = useState('');
  const [welcome, setWelcome] = useState('');
  const [message, setMessage] = useState('');
  const [targetChat, setTargetChat] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({});

  useEffect(() => {
    fetchBotConfig();
  }, []);

  const fetchBotConfig = async () => {
    try {
      const res = await fetch('/api/bot-config');
      const data = await res.json();
      setRules(data.rules || '');
      setWelcome(data.welcome || '');
      setStatus(data.status || {});
    } catch (error) {
      console.error('Error fetching bot config:', error);
    }
  };

  const saveRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules })
      });
      if (res.ok) {
        alert('✅ Reglas guardadas');
      } else {
        alert('❌ Error al guardar reglas');
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const saveWelcome = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ welcome })
      });
      if (res.ok) {
        alert('✅ Mensaje de bienvenida guardado');
      } else {
        alert('❌ Error al guardar bienvenida');
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!message.trim() || !targetChat.trim()) {
      alert('❌ Completa mensaje y chat ID');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/bot-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message.trim(), 
          chat_id: targetChat.trim() 
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Mensaje enviado');
        setMessage('');
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const testBot = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bot-test');
      const data = await res.json();
      if (data.success) {
        alert('✅ Bot responde correctamente');
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <Sidebar currentPage="bot-admin" />

      <main className="main-content">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Bot Administration</h1>
              <p className="page-subtitle">Configure bot rules, welcome messages, and send messages</p>
            </div>
            <div className="header-actions">
              <button className="btn gray" onClick={testBot} disabled={loading}>
                {loading ? 'Testing...' : 'Test Bot'}
              </button>
              <button className="btn blue" onClick={fetchBotConfig}>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="page-content">
          <div className="container">
            <div style={{display:'grid', gap:'24px', gridTemplateColumns:'1fr 1fr'}}>
              {/* Rules Configuration */}
              <div className="card">
                <h3>📜 Reglas del Grupo</h3>
                <div style={{marginBottom:'16px'}}>
                  <label style={{fontSize:'14px', fontWeight:'600', color:'var(--text)', display:'block', marginBottom:'8px'}}>
                    Reglas (una por línea):
                  </label>
                  <textarea
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    placeholder="1) Respeto; nada de insultos ni spam.&#10;2) No ventas, solo compatibilidad de teléfonos en Cuba.&#10;3) Aporta datos reales con /subir.&#10;4) Usa /reportar para avisar de errores.&#10;5) La base es de todos, nadie puede privatizarla."
                    style={{
                      width:'100%',
                      height:'200px',
                      padding:'12px',
                      border:'1px solid var(--border)',
                      borderRadius:'8px',
                      fontSize:'14px',
                      fontFamily:'monospace',
                      resize:'vertical'
                    }}
                  />
                </div>
                <button 
                  className="btn green"
                  onClick={saveRules}
                  disabled={loading}
                  style={{width:'100%'}}
                >
                  {loading ? 'Guardando...' : '💾 Guardar Reglas'}
                </button>
              </div>

              {/* Welcome Message Configuration */}
              <div className="card">
                <h3>👋 Mensaje de Bienvenida</h3>
                <div style={{marginBottom:'16px'}}>
                  <label style={{fontSize:'14px', fontWeight:'600', color:'var(--text)', display:'block', marginBottom:'8px'}}>
                    Mensaje de bienvenida (se envía por DM):
                  </label>
                  <textarea
                    value={welcome}
                    onChange={(e) => setWelcome(e.target.value)}
                    placeholder="👋 ¡Bienvenido {fullname} a CubaModel! 🇨🇺📱&#10;&#10;Este proyecto nació porque antes intentaron cobrar por una base que la comunidad creó gratis.&#10;Aquí todo es distinto: la información será siempre abierta y descargable.&#10;&#10;⚠️ Limitaciones:&#10;• Puede ir lento en horas pico.&#10;• Hay topes de consultas y almacenamiento.&#10;• Puede caerse o fallar a veces (fase de desarrollo).&#10;&#10;📜 Reglas:&#10;1) Respeto; nada de insultos ni spam.&#10;2) No ventas, solo compatibilidad de teléfonos en Cuba.&#10;3) Aporta datos reales con /subir.&#10;4) Usa /reportar para avisar de errores.&#10;5) La base es de todos, nadie puede privatizarla.&#10;&#10;Gracias por sumarte. Esto es de todos y para todos. ✨"
                    style={{
                      width:'100%',
                      height:'300px',
                      padding:'12px',
                      border:'1px solid var(--border)',
                      borderRadius:'8px',
                      fontSize:'14px',
                      fontFamily:'monospace',
                      resize:'vertical'
                    }}
                  />
                  <small style={{color:'var(--muted)', fontSize:'12px'}}>
                    Variables disponibles: {fullname}, {username}, {chat_title}
                  </small>
                </div>
                <button 
                  className="btn blue"
                  onClick={saveWelcome}
                  disabled={loading}
                  style={{width:'100%'}}
                >
                  {loading ? 'Guardando...' : '💾 Guardar Bienvenida'}
                </button>
              </div>
            </div>

            {/* Send Message */}
            <div className="card" style={{marginTop:'24px'}}>
              <h3>📤 Enviar Mensaje</h3>
              <div style={{display:'grid', gap:'16px', gridTemplateColumns:'1fr 1fr'}}>
                <div>
                  <label style={{fontSize:'14px', fontWeight:'600', color:'var(--text)', display:'block', marginBottom:'8px'}}>
                    Chat ID (grupo o usuario):
                  </label>
                  <input
                    type="text"
                    value={targetChat}
                    onChange={(e) => setTargetChat(e.target.value)}
                    placeholder="-1001234567890 (grupo) o 123456789 (usuario)"
                    style={{
                      width:'100%',
                      padding:'12px',
                      border:'1px solid var(--border)',
                      borderRadius:'8px',
                      fontSize:'14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{fontSize:'14px', fontWeight:'600', color:'var(--text)', display:'block', marginBottom:'8px'}}>
                    Mensaje:
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mensaje a enviar..."
                    style={{
                      width:'100%',
                      padding:'12px',
                      border:'1px solid var(--border)',
                      borderRadius:'8px',
                      fontSize:'14px'
                    }}
                  />
                </div>
              </div>
              <button 
                className="btn green"
                onClick={sendMessage}
                disabled={loading || !message.trim() || !targetChat.trim()}
                style={{width:'100%', marginTop:'16px'}}
              >
                {loading ? 'Enviando...' : '📤 Enviar Mensaje'}
              </button>
            </div>

            {/* Bot Status */}
            <div className="card" style={{marginTop:'24px'}}>
              <h3>🤖 Estado del Bot</h3>
              <div style={{display:'grid', gap:'12px', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))'}}>
                <div className="row">
                  <span>Token:</span>
                  <div className={status.bot ? 'badge ok' : 'badge err'}>
                    {status.bot ? 'Configurado' : 'Faltante'}
                  </div>
                </div>
                <div className="row">
                  <span>Webhook:</span>
                  <div className={status.webhook ? 'badge ok' : 'badge err'}>
                    {status.webhook ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
                <div className="row">
                  <span>KV:</span>
                  <div className={status.kv ? 'badge ok' : 'badge err'}>
                    {status.kv ? 'Conectado' : 'Desconectado'}
                  </div>
                </div>
                <div className="row">
                  <span>Supabase:</span>
                  <div className={status.supabase ? 'badge ok' : 'badge err'}>
                    {status.supabase ? 'Conectado' : 'Desconectado'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
