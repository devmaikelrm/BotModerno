
import { useEffect, useState } from 'react';

function IconUsers(){ return (<span>👥</span>); }

export default function Home(){
  const [status, setStatus] = useState({ bot:false, db:false, vercel:true, active_users:0 });
  const refresh = () => fetch('/api/status').then(r=>r.json()).then(setStatus).catch(()=>{});
  useEffect(()=>{ refresh(); }, []);
  
  const Card = ({title, ok, reason}) => (
    <div className="card">
      <h3>{title}</h3>
      <div className={ok ? 'badge ok' : 'badge err'}>{ok ? 'OK' : 'Error'}</div>
      {!ok && <div className="reason">{reason}</div>}
    </div>
  );
  
  return (
    <div style={{display:'flex', minHeight:'100vh', background:'var(--bg)'}}>
      {/* Sidebar */}
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
            <a href="/" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', background:'var(--blue)', color:'white', textDecoration:'none', fontWeight:'600'}}>
              <span>⚡</span>
              <span>Dashboard</span>
            </a>
            <a href="/" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', color:'var(--muted)', textDecoration:'none', fontWeight:'600'}}>
              <span>⚙️</span>
              <span>Bot Configuration</span>
            </a>
            <a href="/exports" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', color:'var(--muted)', textDecoration:'none', fontWeight:'600'}}>
              <span>🗄️</span>
              <span>Database Setup</span>
            </a>
            <a href="/reports" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', color:'var(--muted)', textDecoration:'none', fontWeight:'600'}}>
              <span>🔗</span>
              <span>Webhook Status</span>
            </a>
            <a href="/approved" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', color:'var(--muted)', textDecoration:'none', fontWeight:'600'}}>
              <span>👥</span>
              <span>User Management</span>
            </a>
            <a href="/exports" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', color:'var(--muted)', textDecoration:'none', fontWeight:'600'}}>
              <span>📤</span>
              <span>File Storage</span>
            </a>
            <a href="/reports" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', color:'var(--muted)', textDecoration:'none', fontWeight:'600'}}>
              <span>📊</span>
              <span>Analytics</span>
            </a>
            <a href="/reports" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', color:'var(--muted)', textDecoration:'none', fontWeight:'600'}}>
              <span>⚠️</span>
              <span>Error Logs</span>
            </a>
          </nav>
          
          <div style={{marginTop:'auto', paddingTop:'32px', position:'absolute', bottom:'24px'}}>
            <div style={{fontSize:'12px', color:'var(--muted)', display:'flex', alignItems:'center', justifyContent:'space-between', width:'200px'}}>
              <span>Bot Online</span>
              <span style={{color:'var(--blue)'}}>v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{flex:1}}>
        <header className="appbar">
          <div className="brand"><div className="logo"/><div><div>BotModerno</div><div style={{fontSize:12,color:'#475569'}}>Admin Dashboard</div></div></div>
          <div className="actions">
            <a className="btn green" href="/api/run-setup" target="_blank" rel="noreferrer">Auto Deploy</a>
            <a className="btn gray" href="#" onClick={(e)=>{e.preventDefault(); refresh();}}>Refresh</a>
          </div>
        </header>
        
        <div className="container">
          <h1>Dashboard Overview</h1>
          <div className="subtitle">Monitor and configure your Telegram bot integration</div>
          <div className="grid">
            <Card title="Bot Status" ok={status.bot} reason={status.bot_reason} />
            <Card title="Supabase DB" ok={status.db} reason={status.db_reason} />
            <Card title="Vercel Deploy" ok={status.vercel} reason="Deployed" />
            <div className="card">
              <h3><IconUsers/> Active Users</h3>
              <div className="kpi"><strong>{status.active_users ?? 0}</strong><span className="subtitle">from last week</span></div>
            </div>
          </div>
          <div className="section card">
            <h3>⚡ One-Click Setup & Deployment</h3>
            <div className="subtitle">Automated configuration and deployment process</div>
            <div className="row">
              <div className="progress">
                <div className="pill">Environment Variables <span className="subtitle">completed</span></div>
                <div className="pill">Webhook <span className="subtitle">/api/webhook</span></div>
              </div>
              <a className="btn blue" href="/api/run-setup" target="_blank" rel="noreferrer">Run Full Setup Script</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
