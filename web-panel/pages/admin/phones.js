
import { useEffect, useState } from 'react';

export default function PhonesAdmin(){
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ commercial_name:'', model:'', works:true, bands:'', observations:'' });
  const [editing, setEditing] = useState(null);

  const load = () => fetch(`/api/admin/phones?q=${encodeURIComponent(q)}`).then(r=>r.json()).then(d=>setRows(d.data||[]));
  useEffect(()=>{ load(); }, [q]);

  const save = async () => {
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { id: editing.id, ...form } : form;
    const r = await fetch('/api/admin/phones', { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    if (r.ok){ setForm({ commercial_name:'', model:'', works:true, bands:'', observations:'' }); setEditing(null); load(); } else { alert('Error'); }
  };

  const edit = (row) => { setEditing(row); setForm({ commercial_name:row.commercial_name||'', model:row.model||'', works:!!row.works, bands:row.bands||'', observations:row.observations||'' }); };
  const del = async (id) => { if (!confirm('Eliminar?')) return; await fetch(`/api/admin/phones?id=${id}`, { method:'DELETE' }); load(); };

  return (
    <div className="container">
      <h1>Phones Admin</h1>
      <div className="row" style={{gap:10, marginBottom:12}}>
        <input placeholder="Buscar por nombre comercial..." value={q} onChange={e=>setQ(e.target.value)} style={{padding:8, border:'1px solid #e5e7eb', borderRadius:8, flex:1}}/>
        <a className="btn gray" href="/api/admin/export-json" target="_blank" rel="noreferrer">Export JSON</a>
        <a className="btn gray" href="/api/admin/export-csv" target="_blank" rel="noreferrer">Export CSV</a>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <h3>{editing ? 'Editar' : 'Nuevo'} modelo</h3>
        <div className="row" style={{gap:10, flexWrap:'wrap'}}>
          <input placeholder="Nombre comercial" value={form.commercial_name} onChange={e=>setForm({...form, commercial_name:e.target.value})} style={{padding:8, border:'1px solid #e5e7eb', borderRadius:8, minWidth:220}}/>
          <input placeholder="Modelo" value={form.model} onChange={e=>setForm({...form, model:e.target.value})} style={{padding:8, border:'1px solid #e5e7eb', borderRadius:8, minWidth:160}}/>
          <select value={form.works ? '1':'0'} onChange={e=>setForm({...form, works: e.target.value==='1'})} style={{padding:8, border:'1px solid #e5e7eb', borderRadius:8}}>
            <option value="1">Funciona</option>
            <option value="0">No funciona</option>
          </select>
          <input placeholder="Bandas (ej: LTE B3/B7)" value={form.bands} onChange={e=>setForm({...form, bands:e.target.value})} style={{padding:8, border:'1px solid #e5e7eb', borderRadius:8, minWidth:220}}/>
          <input placeholder="Observaciones" value={form.observations} onChange={e=>setForm({...form, observations:e.target.value})} style={{padding:8, border:'1px solid #e5e7eb', borderRadius:8, minWidth:260}}/>
          <button className="btn blue" onClick={save}>{editing ? 'Guardar cambios' : 'Crear'}</button>
          {editing && <button className="btn gray" onClick={()=>{ setEditing(null); setForm({ commercial_name:'', model:'', works:true, bands:'', observations:'' }); }}>Cancelar</button>}
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Modelo</th><th>OK</th><th>Bandas</th><th>Obs.</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map(r=> (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.commercial_name}</td>
                <td>{r.model}</td>
                <td>{r.works ? '✅':'❌'}</td>
                <td>{r.bands}</td>
                <td>{r.observations}</td>
                <td>
                  <button className="btn gray" onClick={()=>edit(r)}>Editar</button>{' '}
                  <button className="btn gray" onClick={()=>del(r.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
