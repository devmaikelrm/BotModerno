// web-panel/pages/exports.js
export default function Exports() {
  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif' }}>
      <h1>Exportar</h1>
      <ul>
        <li><a href="/api/export?fmt=json">Descargar JSON</a></li>
        <li><a href="/api/export?fmt=csv">Descargar CSV</a></li>
      </ul>
      <p><a href="/">Volver</a></p>
    </main>
  );
}
