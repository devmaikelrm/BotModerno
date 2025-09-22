import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';

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

/* Sidebar component is imported from components/Sidebar for consistent layout */

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
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'approved', 'pending'
  const [form, setForm] = useState({ commercial_name:'', model:'', works:true, bands:'', provinces:'', observations:'' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, working: 0, notWorking: 0 });
  
  const load = async (loadAll = false) => {
    setLoading(true);
    try {
      const limit = loadAll ? '10000' : '1000'; // Load up to 10k for "all", 1k for normal
      const res = await fetch(`/api/admin/phones?q=${encodeURIComponent(q)}&to=${limit}&status=${statusFilter}`);
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
  
  useEffect(() => { load(); }, [q, statusFilter]);
  
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
    <div className="app-container">
      <Sidebar currentPage="database" />
      
      <main className="main-content">
        {/* Header */}
        <header className="page-header">
          <div className="header-content">
            <div className="header-left">
             <div className="page-title-block">
               <h1 className="page-title">📱 Phone Management</h1>
               <p className="page-subtitle">Manage phone models and compatibility data</p>
             </div>
             <div className="header-actions">
               <button onClick={() => exportData('json')} className="action-btn btn-secondary">
                 <span>📄</span>
                 <span>Export JSON</span>
               </button>
               <button onClick={() => exportData('csv')} className="action-btn btn-primary">
                 <span>📊</span>
                 <span>Export CSV</span>
               </button>
             </div>
           </div>
         </div>
       </header>

       <div className="page-content">
          {/* Stats Cards */}
          <div className="cards-grid">
            <div className="modern-card">
              <div className="card-header">
                <div className="card-icon">📱</div>
                <div>
                  <h3>Total Phones</h3>
                  <div className="card-desc">{stats.total}</div>
                </div>
              </div>
            </div>
 
            <div className="modern-card">
              <div className="card-header">
                <div className="card-icon">✅</div>
                <div>
                  <h3>Working</h3>
                  <div className="card-desc">{stats.working}</div>
                </div>
              </div>
            </div>
 
            <div className="modern-card">
              <div className="card-header">
                <div className="card-icon">❌</div>
                <div>
                  <h3>Not Working</h3>
                  <div className="card-desc">{stats.notWorking}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="modern-card">
            <div className="row">
              <div style={{flex:1}}>
                <ModernInput
                  label=""
                  placeholder="Search by commercial name, model, or brand..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div style={{marginLeft: '16px'}}>
                <ModernInput
                  label=""
                  type="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'approved', label: '✅ Approved' },
                    { value: 'pending', label: '⏳ Pending' }
                  ]}
                />
              </div>
              <div className="action-buttons">
                <button onClick={() => load(false)} disabled={loading} className="action-btn btn-secondary" >
                  {loading ? '🔄' : '🔍'} Search
                </button>
                <button onClick={() => load(true)} disabled={loading} className="action-btn btn-primary" >
                  {loading ? '🔄' : '📱'} Load All
                </button>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="modern-card">
            <div className="panel-header">
              <h2>{editing ? '✏️ Edit Phone Model' : '➕ Add New Phone Model'}</h2>
            </div>
            <div className="p-6">
              <div className="grid">
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
                />
              </div>
 
              <div className="row section">
                <div className="action-buttons">
                  <button
                    onClick={save}
                    disabled={loading || !form.commercial_name || !form.model}
                    className="action-btn btn-primary"
                  >
                    {loading ? '⏳ Saving...' : editing ? '💾 Update Phone' : '➕ Add Phone'}
                  </button>
                </div>
 
                {editing && (
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setEditing(null);
                        setForm({ commercial_name:'', model:'', works:true, bands:'', provinces:'', observations:'' });
                      }}
                      className="action-btn btn-secondary"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phones Table */}
          <div className="modern-card">
            <div className="card-header">
              <h3>Phone Database ({rows.length} entries)</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table">
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
                            className="btn blue"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => del(row.id)}
                            className="btn gray"
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
      </main>
    </div>
  );
}
