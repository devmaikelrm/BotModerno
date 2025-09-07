
import { useEffect, useState } from 'react';

function StatusCard({ title, status, description, icon }) {
  return (
    <div className="modern-card">
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <div>
          <h3>{title}</h3>
          <p className="card-desc">{description}</p>
        </div>
      </div>
      <div className={`status-badge ${status ? 'status-ok' : 'status-error'}`}>
        {status ? '✅ Online' : '❌ Offline'}
      </div>
    </div>
  );
}

function ActionButton({ label, icon, onClick, primary = false, className = '' }) {
  return (
    <button 
      onClick={onClick} 
      className={`action-btn ${primary ? 'btn-primary' : 'btn-secondary'} ${className}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function Sidebar({ currentPage = 'dashboard' }) {
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
    <div className="sidebar">
      <div className="sidebar-content">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">C</div>
          <div>
            <div className="logo-title">CubaModel Bot</div>
            <div className="logo-subtitle">Admin Dashboard</div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`nav-item ${currentPage === item.id ? 'nav-active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {currentPage !== item.id && <span className="nav-arrow">→</span>}
            </a>
          ))}
        </nav>
        
        {/* Status */}
        <div className="sidebar-status">
          <div className="status-row">
            <span>Status</span>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>Online</span>
            </div>
          </div>
          <div className="version">v2.1.0</div>
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
    <div className="app-container">
      <Sidebar currentPage="dashboard" />
      
      <div className="main-content">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Dashboard Overview</h1>
              <p className="page-subtitle">Monitor and control your Telegram bot system</p>
            </div>
            <div className="header-actions">
              <ActionButton
                onClick={refresh}
                icon={loading ? '🔄' : '🔄'}
                label="Refresh"
                className={loading ? 'loading' : ''}
              />
              <ActionButton
                onClick={() => handleQuickAction('setup')}
                icon="🚀"
                label="Auto Setup"
                primary={true}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-content">
          {/* Status Cards */}
          <div className="cards-grid">
            <StatusCard
              title="Bot Status"
              description="Telegram bot connectivity"
              icon="🤖"
              status={status.bot}
            />
            <StatusCard
              title="Database"
              description="Supabase connection"
              icon="🗄️"
              status={status.db}
            />
            <StatusCard
              title="Deployment"
              description="Vercel hosting status"
              icon="☁️"
              status={status.vercel}
            />
            <div className="modern-card">
              <div className="card-header">
                <span className="card-icon">👥</span>
                <div>
                  <h3>Active Users</h3>
                  <p className="card-desc">{status.active_users || 0} users this week</p>
                </div>
              </div>
              <div className="user-count">{status.active_users || 0}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="actions-panel">
            <div className="panel-header">
              <h2>⚡ One-Click Automation</h2>
              <p>Automated setup and deployment tools</p>
            </div>
            
            <div className="actions-grid">
              <div className="action-group">
                <h3>🔧 Setup & Config</h3>
                <div className="action-buttons">
                  <ActionButton
                    onClick={() => handleQuickAction('setup')}
                    icon="🤖"
                    label="Configure Bot Webhook"
                    primary={true}
                  />
                  <ActionButton
                    onClick={() => window.location.href = '/bot-config'}
                    icon="⚙️"
                    label="Bot Settings"
                  />
                </div>
              </div>
              
              <div className="action-group">
                <h3>🚀 Deployment</h3>
                <div className="action-buttons">
                  <ActionButton
                    onClick={() => handleQuickAction('deploy')}
                    icon="☁️"
                    label="Deploy to Vercel"
                    primary={true}
                  />
                  <ActionButton
                    onClick={() => window.location.href = '/webhook-status'}
                    icon="🔗"
                    label="Check Webhook"
                  />
                </div>
              </div>
              
              <div className="action-group">
                <h3>📊 Management</h3>
                <div className="action-buttons">
                  <ActionButton
                    onClick={() => window.location.href = '/admin/phones'}
                    icon="📱"
                    label="Manage Phones"
                    primary={true}
                  />
                  <ActionButton
                    onClick={() => window.location.href = '/exports'}
                    icon="📤"
                    label="Export Data"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
