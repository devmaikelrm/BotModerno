
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
    <>
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
          <h3>One-Click Setup & Deployment</h3>
          <div className="row">
            <div className="progress">
              <div className="pill">Environment Variables <span className="subtitle">completed</span></div>
              <div className="pill">Webhook <span className="subtitle">/api/webhook</span></div>
            </div>
            <a className="btn blue" href="/api/run-setup" target="_blank" rel="noreferrer">Run Full Setup Script</a>
          </div>
        </div>
      </div>
    </>
  );
}
