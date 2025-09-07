
import { useEffect, useState } from 'react';

function ModernCard({ title, status, description, icon, actions, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-600 to-indigo-600',
    green: 'from-green-600 to-emerald-600',
    purple: 'from-purple-600 to-pink-600',
    orange: 'from-orange-600 to-red-600'
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className={`h-2 bg-gradient-to-r ${colorClasses[color]}`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white`}>
              <span className="text-xl">{icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          </div>
          {status && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === 'active' ? 'bg-green-100 text-green-800' : 
              status === 'error' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {status}
            </span>
          )}
        </div>
        {actions && (
          <div className="space-y-2">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  action.primary 
                    ? `bg-gradient-to-r ${colorClasses[color]} text-white hover:shadow-lg transform hover:-translate-y-0.5`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({ currentPage = 'dashboard' }) {
  const menuItems = [
    { icon: '⚡', label: 'Dashboard', href: '/', id: 'dashboard' },
    { icon: '🤖', label: 'Bot Config', href: '/bot-config', id: 'bot-config' },
    { icon: '🗄️', label: 'Database', href: '/admin/phones', id: 'database' },
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

export default function Home() {
  const [status, setStatus] = useState({ bot: false, db: false, vercel: true, active_users: 0 });
  const [loading, setLoading] = useState(false);
  
  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { refresh(); }, []);
  
  const handleQuickAction = async (action) => {
    setLoading(true);
    try {
      if (action === 'setup') {
        window.open('/api/run-setup', '_blank');
      } else if (action === 'deploy') {
        window.open('/api/full-setup', '_blank');
      } else if (action === 'config') {
        window.location.href = '/bot-config';
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar currentPage="dashboard" />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Monitor and control your Telegram bot system</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200 disabled:opacity-50"
                >
                  <span className={loading ? 'animate-spin' : ''}>🔄</span>
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => handleQuickAction('setup')}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>🚀</span>
                  <span>Auto Setup</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ModernCard
              title="Bot Status"
              description="Telegram bot connectivity"
              icon="🤖"
              status={status.bot ? 'active' : 'error'}
              color="blue"
              actions={[
                {
                  label: 'Configure Bot',
                  icon: '⚙️',
                  primary: true,
                  onClick: () => handleQuickAction('config')
                }
              ]}
            />
            
            <ModernCard
              title="Database"
              description="Supabase connection"
              icon="🗄️"
              status={status.db ? 'active' : 'error'}
              color="green"
              actions={[
                {
                  label: 'View Data',
                  icon: '👁️',
                  primary: true,
                  onClick: () => window.location.href = '/admin/phones'
                }
              ]}
            />
            
            <ModernCard
              title="Deployment"
              description="Vercel hosting status"
              icon="☁️"
              status={status.vercel ? 'active' : 'warning'}
              color="purple"
              actions={[
                {
                  label: 'Deploy Now',
                  icon: '🚀',
                  primary: true,
                  onClick: () => handleQuickAction('deploy')
                }
              ]}
            />
            
            <ModernCard
              title="Active Users"
              description={`${status.active_users || 0} users this week`}
              icon="👥"
              status="active"
              color="orange"
              actions={[
                {
                  label: 'View Analytics',
                  icon: '📊',
                  primary: true,
                  onClick: () => window.location.href = '/analytics'
                }
              ]}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <span>⚡</span>
                <span>One-Click Automation</span>
              </h2>
              <p className="opacity-90 mt-1">Automated setup and deployment tools</p>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">🔧 Setup & Config</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleQuickAction('setup')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span className="mr-2">🤖</span>
                      Configure Bot Webhook
                    </button>
                    <button
                      onClick={() => window.location.href = '/bot-config'}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                    >
                      <span className="mr-2">⚙️</span>
                      Bot Settings
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">🚀 Deployment</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleQuickAction('deploy')}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span className="mr-2">☁️</span>
                      Deploy to Vercel
                    </button>
                    <button
                      onClick={() => window.location.href = '/webhook-status'}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                    >
                      <span className="mr-2">🔗</span>
                      Check Webhook
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">📊 Management</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => window.location.href = '/admin/phones'}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span className="mr-2">📱</span>
                      Manage Phones
                    </button>
                    <button
                      onClick={() => window.location.href = '/exports'}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                    >
                      <span className="mr-2">📤</span>
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
