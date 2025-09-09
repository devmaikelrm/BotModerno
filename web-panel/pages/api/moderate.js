// web-panel/pages/api/moderate.js
import { getAdminClient } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const db = getAdminClient();
    const { id, action } = req.method === 'POST' ? req.body : req.query;
    if (!id) return res.status(400).json({ ok: false, error: 'missing id' });

    if (action === 'approve') {
      const { error } = await db.from('phones').update({ status: 'approved' }).eq('id', id);
      if (error) return res.status(500).json({ ok: false, error: error.message });
      return res.status(200).json({ ok: true });
    }
    if (action === 'reject') {
      const { error } = await db.from('phones').update({ status: 'rejected' }).eq('id', id);
      if (error) return res.status(500).json({ ok: false, error: error.message });
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ ok: false, error: 'invalid action' });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
}
