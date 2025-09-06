// web-panel/pages/reports.js
import { adminClient } from '../lib/serverClient';

export async function getServerSideProps() {
  const db = adminClient();
  const { data } = await db.from('reports').select('*').eq('status','open').order('id', { ascending: false }).limit(200);
  return { props: { rows: data || [] } };
}

export default function Reports({ rows }) {
  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif' }}>
      <h1>Reportes abiertos</h1>
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Phone</th><th>Usuario</th><th>Texto</th><th>Acción</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.phone_id}</td>
              <td>{r.reporter_username || r.reporter_tg_id}</td>
              <td>{r.text}</td>
              <td>
                <form method="post" action="/api/reports">
                  <input type="hidden" name="id" value={r.id} />
                  <button name="action" value="reviewed">Marcar revisado</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><a href="/">Volver</a></p>
    </main>
  );
}
