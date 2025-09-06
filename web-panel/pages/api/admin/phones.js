
import { getAdminClient } from '../../../../lib/supabase';
export default async function handler(req, res){
  const db = getAdminClient();
  if (req.method === 'GET'){
    const { from='0', to='50', q='' } = req.query;
    let query = db.from('phones').select('*').order('created_at', { ascending:false }).range(parseInt(from), parseInt(to));
    if (q) query = db.from('phones').select('*').ilike('commercial_name', `%${q}%`).order('created_at', { ascending:false }).range(parseInt(from), parseInt(to));
    const { data, error } = await query; if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ data });
  }
  if (req.method === 'POST'){
    const { commercial_name, model, works, bands, observations } = req.body || {};
    const { data, error } = await db.from('phones').insert({ commercial_name, model, works, bands, observations }).select('*').single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ data });
  }
  if (req.method === 'PUT'){
    const { id, ...patch } = req.body || {};
    const { data, error } = await db.from('phones').update(patch).eq('id', id).select('*').single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ data });
  }
  if (req.method === 'DELETE'){
    const { id } = req.query;
    const { error } = await db.from('phones').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ ok:true });
  }
  return res.status(405).json({ error:'Method not allowed' });
}
