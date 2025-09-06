// web-panel/pages/approved.js
import { createClient } from '@supabase/supabase-js';

export async function getServerSideProps() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const db = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await db.from('phones').select('*').eq('status','approved').order('created_at', { ascending: false });
  return { props: { rows: error ? [] : (data || []) } };
}

export default function Approved({ rows }) {
  return (
    <div className="container">
      <h1>Modelos aprobados</h1>
      <div className="card">
        <table className="table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Modelo</th><th>Bandas</th><th>Provincias</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.commercial_name}</td>
                <td>{r.model}</td>
                <td>{Array.isArray(r.bands) ? r.bands.join(' / ') : r.bands}</td>
                <td>{Array.isArray(r.provinces) ? r.provinces.join(' / ') : r.provinces}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
