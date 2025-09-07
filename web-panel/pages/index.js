
import { useEffect, useState } from 'react';

function IconUsers(){ return (<span>👥</span>); }

function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <div>
            <div className="font-bold text-gray-900">CubaModel Bot</div>
            <div className="text-sm text-gray-500">Admin Dashboard</div>
          </div>
        </div>
        
        <nav className="space-y-2">
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white">
            <span>⚡</span>
            <span>Dashboard</span>
          </a>
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <span>⚙️</span>
            <span>Bot Configuration</span>
          </a>
          <a href="/exports" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <span>🗄️</span>
            <span>Database Setup</span>
          </a>
          <a href="/reports" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <span>🔗</span>
            <span>Webhook Status</span>
          </a>
          <a href="/approved" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <span>👥</span>
            <span>User Management</span>
          </a>
          <a href="/exports" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <span>📤</span>
            <span>File Storage</span>
          </a>
          <a href="/reports" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <span>📊</span>
            <span>Analytics</span>
          </a>
          <a href="/reports" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <span>⚠️</span>
            <span>Error Logs</span>
          </a>
        </nav>
        
        <div className="mt-auto pt-8">
          <div className="text-sm text-gray-500 flex items-center justify-between">
            <span>Bot Online</span>
            <span className="text-blue-600">v2.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home(){
  const [status, setStatus] = useState({ bot:false, db:false, vercel:true, active_users:0 });
  const refresh = () => fetch('/api/status').then(r=>r.json()).then(setStatus).catch(()=>{});
  useEffect(()=>{ refresh(); }, []);
  
  const Card = ({title, ok, reason}) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        {title === 'Bot Status' && '🤖'}
        {title === 'Supabase DB' && '🗄️'}
        {title === 'Vercel Deploy' && '🚀'}
        {title}
      </h3>
      <div className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${
        ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {ok ? 'OK' : 'Error'}
      </div>
      {!ok && <div className="mt-2 text-sm text-red-600">{reason}</div>}
    </div>
  );
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="border-b border-gray-200 bg-white">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600">Monitor and configure your Telegram bot integration</p>
            </div>
            <div className="flex gap-3">
              <a className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700" 
                 href="/api/run-setup" target="_blank" rel="noreferrer">
                Auto Deploy
              </a>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200" 
                      onClick={(e)=>{e.preventDefault(); refresh();}}>
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card title="Bot Status" ok={status.bot} reason={status.bot_reason} />
            <Card title="Supabase DB" ok={status.db} reason={status.db_reason} />
            <Card title="Vercel Deploy" ok={status.vercel} reason="Deployed" />
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <IconUsers/> Active Users
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{status.active_users ?? 0}</span>
                <span className="text-sm text-gray-500">from last week</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              ⚡ One-Click Setup & Deployment
            </h3>
            <p className="text-gray-600 mb-6">Automated configuration and deployment process</p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-full text-sm">
                  Environment Variables <span className="text-green-600 font-semibold">completed</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-sm">
                  Webhook <span className="text-blue-600 font-semibold">/api/webhook</span>
                </div>
              </div>
              <a className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700" 
                 href="/api/run-setup" target="_blank" rel="noreferrer">
                Run Full Setup Script
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
