
import { getAdminClient } from '../../../lib/supabase';

export default async function handler(req, res){
  const out = { bot: !!process.env.BOT_TOKEN, bot_reason: '' };

  try{
    const db = getAdminClient();
    const { error } = await db.from('phones').select('id', { count: 'exact', head: true });
    out.db = !error;
    if (error) out.db_reason = error.message;

    // active users last 7d
    const since = new Date(Date.now() - 7*24*60*60*1000).toISOString();
    const { data: ev, error: e2 } = await db.from('events').select('tg_id').gte('created_at', since);
    out.active_users = e2 ? 0 : new Set((ev||[]).map(x=>x.tg_id).filter(Boolean)).size;
  }catch(e){
    out.db = false;
    out.db_reason = String(e?.message || e);
    out.active_users = 0;
  }

  out.vercel = true;
  res.status(200).json(out);
}
