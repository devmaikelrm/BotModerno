// web-panel/pages/index.js
import { adminClient } from '../lib/serverClient';

export async function getServerSideProps() {
  const db = adminClient();
  const { data } = await db.from('phones').select('*').eq('status','pending').order('id', { ascending: false }).limit(200);
  return { props: { rows: data || [] } };
}

export default function Home({ rows }) {
  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif' }}>
      <h1>Pendientes</h1>
      <p>Total: {rows.length}</p>
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Nombre</th><th>Modelo</th><th>Funciona</th><th>Bands</th><th>Obs</th><th>Acciones</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.commercial_name}</td>
              <td>{r.model}</td>
              <td>{String(r.works_in_cuba)}</td>
              <td>{(r.bands||[]).join('|')}</td>
              <td>{r.observations||''}</td>
              <td>
                <form method="post" action="/api/moderate">
                  <input type="hidden" name="id" value={r.id} />
                  <button name="action" value="approve">Aprobar</button>
                  <button name="action" value="reject">Rechazar</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><a href="/approved">Ver aprobados</a> · <a href="/exports">Exportar</a> · <a href="/reports">Reportes</a></p>
    </main>
  );
}
