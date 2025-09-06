
import { getBot } from '../../lib/bot';
import { getAdminClient } from '../../lib/supabase';
export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };
let botInstance;
function bot(){ if (!botInstance) botInstance = getBot(); return botInstance; }
export default async function handler(req, res){
  try{
    if (req.method !== 'POST') return res.status(200).json({ ok:true });
    const update = req.body;
    const from = update?.message?.from?.id || update?.callback_query?.from?.id || null;
    await bot().handleUpdate(update);
    try{ const db = getAdminClient(); await db.from('events').insert({ tg_id: from?String(from):null, type:'message', payload:update }); }catch(e){}
    return res.status(200).json({ ok:true });
  }catch(e){
    try{ const db = getAdminClient(); await db.from('events').insert({ tg_id:null, type:'error', payload:{ message:String(e?.message||e) } }); }catch(_){}
    return res.status(200).json({ ok:true });
  }
}
