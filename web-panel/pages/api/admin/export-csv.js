
import { getAdminClient } from '../../../../lib/supabase';
function toCSV(rows){
  if (!rows || !rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g,'""');
    return `"${s}"`;
  };
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map(h => esc(r[h])).join(','));
  return lines.join('\n');
}
export default async function handler(req, res){
  const db = getAdminClient();
  const { data, error } = await db.from('phones').select('*').order('created_at', { ascending:false });
  if (error) return res.status(400).json({ error: error.message });
  const csv = toCSV(data);
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition','attachment; filename="phones.csv"');
  res.status(200).send(csv);
}
