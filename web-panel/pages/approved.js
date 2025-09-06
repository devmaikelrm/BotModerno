// web-panel/pages/approved.js
import { adminClient } from '../lib/serverClient';

export async function getServerSideProps() {
  const db = adminClient();
  const { data } = await db.from('phones').select('*').eq('status','approved').order('id', { ascending: false }).limit(500);
  return { props: { rows: data || [] } };
}

export default function Approved({ rows }) {
  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif' }}>
      <h1>Aprobados</h1>
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Nombre</th><th>Modelo</th><th>Bands</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.commercial_name}</td>
              <td>{r.model}</td>
              <td>{(r.bands||[]).join('|')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><a href="/">Volver</a></p>
    </main>
  );
}
