
import { getAdminClient } from '../../../lib/supabase';
export default async function handler(req, res){
  const db = getAdminClient();
  const { data, error } = await db.from('phones').select('*').order('created_at', { ascending:false });
  if (error) return res.status(400).json({ error: error.message });
  res.setHeader('Content-Type','application/json');
  res.status(200).send(JSON.stringify(data, null, 2));
}
