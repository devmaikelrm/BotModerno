// web-panel/pages/api/reports.js
import { adminClient } from '../../lib/serverClient';

export default async function handler(req, res) {
  const db = adminClient();
  const { id, action } = req.method === 'POST' ? req.body : req.query;
  if (!id) return res.status(400).json({ error: 'missing id' });
  if (action !== 'reviewed') return res.status(400).json({ error: 'invalid action' });
  const { error } = await db.from('reports').update({ status: 'reviewed' }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  return res.redirect('/reports');
}
