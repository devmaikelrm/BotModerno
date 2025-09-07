import { useState } from 'react';
import { adminClient } from '../lib/serverClient';

export async function getServerSideProps() {
  try {
    const db = adminClient();
    const { data } = await db.from('reports').select('*').eq('status','open').order('id', { ascending: false }).limit(200);
    return { props: { rows: data || [] } };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { props: { rows: [] } };
  }
}

function Sidebar({ currentPage = 'reports' }) {
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

export default function Reports({ rows }) {
  const [reports, setReports] = useState(rows);
  const [loading, setLoading] = useState(false);
  
  const handleAction = async (reportId, action) => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: reportId, action }),
      });
      
      if (response.ok) {
        // Remove the report from the list
        setReports(reports.filter(r => r.id !== reportId));
      } else {
        alert('Error processing report');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getPriorityColor = (report) => {
    // You can add logic here to determine priority based on content
    if (report.text && report.text.toLowerCase().includes('urgente')) {
      return 'border-l-red-500';
    }
    return 'border-l-blue-500';
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar currentPage="reports" />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">📋 User Reports</h1>
                <p className="text-gray-600 mt-1">Manage user-submitted issue reports</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-xl border border-orange-200">
                  <span className="text-sm font-medium text-orange-800">
                    {reports.length} Open Reports
                  </span>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200"
                >
                  <span>🔄</span>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                    <span className="text-xl">⚠️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Open Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    <span className="text-xl">👥</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Unique Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(reports.map(r => r.reporter_tg_id)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Action Required</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(r => r.text?.toLowerCase().includes('urgente')).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Open Reports</h3>
              <p className="text-sm text-gray-600 mt-1">Review and manage user-submitted reports</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {reports.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">🎉</div>
                  <div className="text-xl font-semibold text-gray-600 mb-2">No Open Reports!</div>
                  <div className="text-gray-500">All user reports have been resolved.</div>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className={`p-6 border-l-4 ${getPriorityColor(report)} hover:bg-gray-50 transition-colors duration-200`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-mono text-gray-600">#{report.id}</span>
                          </div>
                          
                          {report.phone_id && (
                            <div className="bg-blue-100 px-3 py-1 rounded-full">
                              <span className="text-xs font-medium text-blue-800">Phone #{report.phone_id}</span>
                            </div>
                          )}
                          
                          <div className="bg-green-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-medium text-green-800">
                              👤 {report.reporter_username || `User ${report.reporter_tg_id}`}
                            </span>
                          </div>
                          
                          {report.created_at && (
                            <div className="bg-gray-100 px-3 py-1 rounded-full">
                              <span className="text-xs text-gray-600">
                                📅 {formatDate(report.created_at)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Report Content:</h4>
                          <p className="text-gray-700 leading-relaxed">{report.text}</p>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col space-y-2">
                        <button
                          onClick={() => handleAction(report.id, 'reviewed')}
                          disabled={loading}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                        >
                          ✅ Mark Reviewed
                        </button>
                        
                        <button
                          onClick={() => handleAction(report.id, 'dismissed')}
                          disabled={loading}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                        >
                          🗑️ Dismiss
                        </button>
                        
                        {report.phone_id && (
                          <button
                            onClick={() => window.open(`/admin/phones?highlight=${report.phone_id}`, '_blank')}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-all duration-200"
                          >
                            🔍 View Phone
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {reports.length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (confirm('Mark all reports as reviewed?')) {
                      reports.forEach(r => handleAction(r.id, 'reviewed'));
                    }
                  }}
                  className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  ✅ Mark All as Reviewed
                </button>
                
                <button
                  onClick={() => window.open('/admin/phones', '_blank')}
                  className="px-4 py-2 bg-white border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  📱 Manage Phones
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
