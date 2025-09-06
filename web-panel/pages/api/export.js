// web-panel/pages/api/export.js
import { adminClient } from '../../lib/serverClient';

function toCSV(rows) {
  const header = ['id','commercial_name','model','works_in_cuba','bands','observations'];
  const lines = [header.join(',')];
  for (const r of rows) {
    const bands = (r.bands || []).join('|');
    const cells = [
      r.id,
      csv(r.commercial_name),
      csv(r.model),
      r.works_in_cuba ? 'true' : 'false',
      csv(bands),
      csv(r.observations || '')
    ];
    lines.push(cells.join(','));
  }
  return lines.join('\n');
}
function csv(s) {
  s = String(s);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
  return s;
}

export default async function handler(req, res) {
  const fmt = (req.query.fmt || 'json').toString();
  const db = adminClient();
  const { data, error } = await db.from('phones').select('*').eq('status','approved').limit(100000);
  if (error) return res.status(500).json({ error: error.message });
  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  if (fmt === 'csv') {
    const csvStr = toCSV(data || []);
    res.setHeader('Content-Type','text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="phones-${ts}.csv"`);
    return res.status(200).send(csvStr);
  } else {
    res.setHeader('Content-Type','application/json');
    res.setHeader('Content-Disposition', `attachment; filename="phones-${ts}.json"`);
    return res.status(200).send(JSON.stringify(data || [], null, 2));
  }
}
