// web-panel/pages/api/moderate.js
import { adminClient } from '../../lib/serverClient';

export default async function handler(req, res) {
  const db = adminClient();
  const { id, action } = req.method === 'POST' ? req.body : req.query;
  if (!id) return res.status(400).json({ error: 'missing id' });

  if (action === 'approve') {
    const { error } = await db.from('phones').update({ status: 'approved' }).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.redirect('/');
  }
  if (action === 'reject') {
    const { error } = await db.from('phones').update({ status: 'rejected' }).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.redirect('/');
  }
  return res.status(400).json({ error: 'invalid action' });
}
