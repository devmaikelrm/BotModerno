// web-panel/pages/dashboard.js
import { adminClient } from "../lib/serverClient";

async function getBotStatus() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:5000';
    
    const response = await fetch(`${baseUrl}/api/status`, { 
      cache: "no-store",
      headers: {
        'User-Agent': 'BotModerno-Dashboard'
      }
    });
    
    if (!response.ok) {
      return { ok: false, reason: `HTTP ${response.status}` };
    }
    
    const data = await response.json();
    return {
      ok: data.bot?.online || false,
      reason: data.bot?.reason || 'Unknown error',
      details: data.bot,
      db: data.db
    };
  } catch (error) {
    return { 
      ok: false, 
      reason: `Connection error: ${error.message}`,
      details: null
    };
  }
}

async function getDbStatus() {
  try {
    const db = adminClient();
    const { error } = await db.from("phones").select("id").limit(1);
    return { ok: !error, reason: error ? "No client available" : "" };
  } catch {
    return { ok: false, reason: "No client available" };
  }
}

export async function getServerSideProps() {
  const db = adminClient();
  const [bot, dbs] = await Promise.all([getBotStatus(), getDbStatus()]);
  const { data: subs } = await db.from("subscriptions").select("*").limit(100);
  const activeUsers = subs?.length ?? 0;
  return { props: { bot, dbs, activeUsers } };
}

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
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white">
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

function StatusCard({ title, status, reason, icon, bgColor = "bg-white" }) {
  const isOnline = status === "Online" || status === "Connected";
  const isError = status === "Offline" || status === "Error";
  
  const statusColor = isOnline ? "text-green-600" : isError ? "text-red-600" : "text-blue-600";
  
  return (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <div className="font-semibold text-gray-900">{title}</div>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
      </div>
      <div className={`text-3xl font-bold ${statusColor} mb-2`}>
        {status}
      </div>
      {reason && <div className="text-sm text-gray-600">• {reason}</div>}
    </div>
  );
}

export default function Dashboard({ bot, dbs, activeUsers }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="border-b border-gray-200 bg-white">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Monitor and configure your Telegram bot integration</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2">
                <span>🚀</span>
                Auto Deploy
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium flex items-center gap-2">
                <span>🔄</span>
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatusCard 
              title="Bot Status" 
              status={bot.ok ? "Online" : "Offline"} 
              reason={bot.reason || (bot.ok ? "Connected" : "Not connected")}
              icon="🤖"
              bgColor={bot.ok ? "bg-green-50" : "bg-red-50"}
            />
            <StatusCard 
              title="Supabase DB" 
              status={dbs.ok ? "Connected" : "Error"} 
              reason={dbs.reason || (dbs.ok ? "Database accessible" : "Connection failed")}
              icon="🗄️"
              bgColor={dbs.ok ? "bg-green-50" : "bg-red-50"}
            />
            <StatusCard 
              title="Web Panel" 
              status="Online" 
              reason="Vercel deployment active"
              icon="☁️"
              bgColor="bg-green-50"
            />
            <StatusCard 
              title="Active Users" 
              status={bot.db?.activeUsers || activeUsers || 0}
              reason="from last week"
              icon="👥"
              bgColor="bg-blue-50"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚡</span>
              <h2 className="text-xl font-bold text-gray-900">One-Click Setup & Deployment</h2>
            </div>
            <p className="text-gray-600 mb-6">Automated configuration and deployment process</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Setup Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Environment Variables</span>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">completed</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                  <span>▶️</span>
                  Run Full Setup Script
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
