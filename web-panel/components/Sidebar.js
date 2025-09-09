import React from 'react';

export default function Sidebar({ currentPage = 'dashboard' }) {
  const menuItems = [
    { icon: '⚡', label: 'Dashboard', href: '/', id: 'dashboard' },
    { icon: '🤖', label: 'Bot Config', href: '/bot-config', id: 'bot-config' },
    { icon: '⚙️', label: 'Bot Admin', href: '/bot-admin', id: 'bot-admin' },
    { icon: '📱', label: 'Phones', href: '/admin/phones', id: 'database' },
    { icon: '🔗', label: 'Webhook', href: '/webhook-status', id: 'webhook' },
    { icon: '🛡️', label: 'Moderation', href: '/moderation', id: 'moderation' },
    { icon: '👥', label: 'Approved', href: '/approved', id: 'users' },
    { icon: '📊', label: 'Analytics', href: '/analytics', id: 'analytics' },
    { icon: '📤', label: 'Exports', href: '/exports', id: 'exports' },
    { icon: '📋', label: 'Reports', href: '/reports', id: 'reports' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-logo">
          <div className="logo-icon">C</div>
          <div>
            <div className="logo-title">CubaModel Bot</div>
            <div className="logo-subtitle">Admin Dashboard</div>
          </div>
        </div>
 
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`nav-item ${currentPage === item.id ? 'nav-active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              <span className="nav-arrow">→</span>
            </a>
          ))}
        </nav>
 
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
    </aside>
  );
}