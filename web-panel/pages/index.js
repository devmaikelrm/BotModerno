
import { useEffect, useState } from 'react';

function IconBot(){ return (<span className="icon">🤖</span>); }
function IconDb(){ return (<span className="icon">🗄️</span>); }
function IconCloud(){ return (<span className="icon">☁️</span>); }
function IconUsers(){ return (<span className="icon">👥</span>); }
function IconFlash(){ return (<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 2v11h3v9l7-13h-4l4-7z"/></svg>); }
function IconRefresh(){ return (<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 13.65-6.65z"/></svg>); }
function IconPlay(){ return (<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>); }

export default function Home() {
  const [status, setStatus] = useState({ bot:false, db:false, vercel:true, active_users:0 });

  const refresh = () => fetch('/api/status').then(r=>r.json()).then(setStatus).catch(()=>{});
  useEffect(() => { refresh(); }, []);

  const Card = ({title, ok, reason, Icon}) => (
    <div className="card">
      <h3><Icon /> {title}</h3>
      <div className={ok ? "badge ok":"badge err"}>{ok ? "OK":"Error"}</div>
      {!ok && reason && <div className="reason">{reason}</div>}
    </div>
  );

  return (
    <>
      <header className="appbar">
        <div className="brand">
          <div className="logo" />
          <div>
            CubaModel Bot
            <div style={{fontSize:12, color:'#475569'}}>Admin Dashboard</div>
          </div>
        </div>
        <div className="actions">
          <a className="btn green" href="#" onClick={(e)=>{e.preventDefault(); alert('Auto Deploy activado (placeholder).')}}><IconFlash/> Auto Deploy</a>
          <a className="btn gray" href="#" onClick={(e)=>{e.preventDefault(); refresh();}}><IconRefresh/> Refresh</a>
        </div>
      </header>

      <div className="container">
        <h1>Dashboard Overview</h1>
        <div className="subtitle">Monitor and configure your Telegram bot integration</div>

        <div className="grid">
          <Card title="Bot Status" ok={status.bot} reason={status.bot_reason} Icon={IconBot} />
          <Card title="Supabase DB" ok={status.db} reason={status.db_reason} Icon={IconDb} />
          <Card title="Vercel Deploy" ok={status.vercel} reason="Deployed" Icon={IconCloud} />
          <div className="card">
            <h3><IconUsers/> Active Users</h3>
            <div className="kpi">
              <strong>{status.active_users ?? 0}</strong>
              <span className="muted">from last week</span>
            </div>
          </div>
        </div>

        <div className="section card">
          <h3>One-Click Setup &amp; Deployment</h3>
          <div className="row">
            <div className="progress">
              <div className="pill">Environment Variables <span className="muted">completed</span></div>
              <div className="pill">Webhook <span className="muted">/api/webhook</span></div>
            </div>
            <a className="btn blue" href="/api/run-setup" target="_blank" rel="noreferrer"><IconPlay/> Run Full Setup Script</a>
          </div>
        </div>
      </div>
    </>
  );
}
