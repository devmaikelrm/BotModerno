
import { useEffect, useState } from 'react';

// Helpers para parsear arrays
function parseTextToArray(text) {
  if (!text) return [];
  return text
    .replace(/[\r\n]/g, ' ')
    .replace(/[|;]/g, ',')
    .split(/\s*,\s*|\s{2,}/)
    .map(x => x.trim())
    .filter(Boolean);
}
function arrayToText(arr) {
  return (arr || []).join(', ');
}

function Sidebar({ currentPage = 'database' }) {
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

function ModernInput({ label, placeholder, value, onChange, type = 'text', options = null, className = '' }) {
  if (type === 'select') {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      />
    </div>
  );
}

export default function PhonesAdmin() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ commercial_name:'', model:'', works:true, bands:'', provinces:'', observations:'' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, working: 0, notWorking: 0 });
  
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/phones?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      // Convertir arrays a texto para los inputs
      const processedRows = (data.data || []).map(row => ({
        ...row,
        bands: Array.isArray(row.bands) ? arrayToText(row.bands) : (row.bands || ''),
        provinces: Array.isArray(row.provinces) ? arrayToText(row.provinces) : (row.provinces || '')
      }));
      setRows(processedRows);
      
      // Calcular estadísticas
      const total = processedRows.length;
      const working = processedRows.filter(r => r.works).length;
      setStats({ total, working, notWorking: total - working });
    } catch (error) {
      console.error('Error loading phones:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { load(); }, [q]);
  
  const save = async () => {
    setLoading(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id: editing.id, ...form } : form;
      body.bands = parseTextToArray(form.bands);
      body.provinces = parseTextToArray(form.provinces);
      
      const r = await fetch('/api/admin/phones', { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });
      
      if (r.ok) {
        setForm({ commercial_name:'', model:'', works:true, bands:'', provinces:'', observations:'' });
        setEditing(null);
        load();
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const edit = (row) => {
    setEditing(row);
    setForm({
      commercial_name: row.commercial_name || '',
      model: row.model || '',
      works: !!row.works,
      bands: row.bands || '',
      provinces: row.provinces || '',
      observations: row.observations || ''
    });
  };
  
  const del = async (id) => {
    if (!confirm('¿Eliminar este teléfono?')) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/phones?id=${id}`, { method: 'DELETE' });
      load();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportData = (format) => {
    window.open(`/api/admin/export-${format}`, '_blank');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar currentPage="database" />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">📱 Phone Management</h1>
                <p className="text-gray-600 mt-1">Manage phone models and compatibility data</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => exportData('json')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-all duration-200"
                >
                  <span>📄</span>
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>📊</span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Phones</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-600 to-emerald-600"></div>
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Working</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.working}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-600 to-pink-600"></div>
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 text-white">
                    <span className="text-xl">❌</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Not Working</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.notWorking}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <ModernInput
                  label=""
                  placeholder="Search by commercial name, model, or brand..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <button
                onClick={load}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? '🔄' : '🔍'} Search
              </button>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <span>{editing ? '✏️' : '➕'}</span>
                <span>{editing ? 'Edit Phone Model' : 'Add New Phone Model'}</span>
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ModernInput
                  label="Commercial Name"
                  placeholder="iPhone 14 Pro Max"
                  value={form.commercial_name}
                  onChange={(e) => setForm({...form, commercial_name: e.target.value})}
                />
                
                <ModernInput
                  label="Model"
                  placeholder="A2895"
                  value={form.model}
                  onChange={(e) => setForm({...form, model: e.target.value})}
                />
                
                <ModernInput
                  label="Status"
                  type="select"
                  value={form.works ? '1' : '0'}
                  onChange={(e) => setForm({...form, works: e.target.value === '1'})}
                  options={[
                    { value: '1', label: '✅ Works in Cuba' },
                    { value: '0', label: '❌ Does not work' }
                  ]}
                />
                
                <ModernInput
                  label="Supported Bands"
                  placeholder="LTE B3, B7, B20"
                  value={form.bands}
                  onChange={(e) => setForm({...form, bands: e.target.value})}
                  className="md:col-span-2"
                />
                
                <ModernInput
                  label="Provinces"
                  placeholder="La Habana, Matanzas, Santiago"
                  value={form.provinces}
                  onChange={(e) => setForm({...form, provinces: e.target.value})}
                />
                
                <ModernInput
                  label="Observations"
                  placeholder="Additional notes or comments"
                  value={form.observations}
                  onChange={(e) => setForm({...form, observations: e.target.value})}
                  className="md:col-span-2 lg:col-span-3"
                />
              </div>
              
              <div className="flex items-center space-x-4 mt-6">
                <button
                  onClick={save}
                  disabled={loading || !form.commercial_name || !form.model}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? '⏳ Saving...' : editing ? '💾 Update Phone' : '➕ Add Phone'}
                </button>
                
                {editing && (
                  <button
                    onClick={() => {
                      setEditing(null);
                      setForm({ commercial_name:'', model:'', works:true, bands:'', provinces:'', observations:'' });
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Phones Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Phone Database ({rows.length} entries)</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commercial Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bands</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provinces</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{row.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{row.commercial_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          row.works 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.works ? '✅ Works' : '❌ No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{row.bands}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{row.provinces}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => edit(row)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => del(row.id)}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {rows.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">📱</div>
                  <div className="text-gray-500">No phones found. Add the first one!</div>
                </div>
              )}
              
              {loading && (
                <div className="text-center py-12">
                  <div className="text-blue-500 text-lg mb-2">🔄</div>
                  <div className="text-gray-500">Loading phones...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
