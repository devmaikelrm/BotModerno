import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Moderation() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/phones?q=');
      const data = await res.json();
      const pending = (data.data || []).filter(r => (r.status || 'pending') === 'pending');
      setRows(pending);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    try {
      const res = await fetch(`/api/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        load();
      } else {
        alert(`Error performing action${data?.error ? ': ' + data.error : ''}`);
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentPage="moderation" />
      <div className="main-content">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Moderate Submissions</h1>
              <p className="page-subtitle">Approve or reject user-submitted models</p>
            </div>
            <div className="header-actions">
              <button onClick={load} className="action-btn btn-secondary">🔄 Refresh</button>
            </div>
          </div>
        </div>

        <div className="page-content">
          <div className="modern-card">
            <div className="card-header">
              <span className="card-icon">🛡️</span>
              <div>
                <h3>Pending Models</h3>
                <p className="card-desc">{rows.length} awaiting review</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Commercial Name</th>
                    <th>Model</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>{r.commercial_name}</td>
                      <td>{r.model}</td>
                      <td>
                        <div className="action-buttons" style={{display:'flex',gap:8}}>
                          <button onClick={() => act(r.id, 'approve')} className="action-btn btn-primary">✅ Approve</button>
                          <button onClick={() => act(r.id, 'reject')} className="action-btn btn-secondary">❌ Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && !loading && (
                    <tr><td colSpan="4"><div className="text-center" style={{padding:24}}>No pending submissions</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


