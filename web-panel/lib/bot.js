
import { Telegraf } from 'telegraf';
import { getAdminClient } from './supabase';
async function getDraft(db, tgId){
  const { data } = await db.from('submission_drafts').select('*').eq('tg_id', String(tgId)).maybeSingle();
  return data || null;
}
async function setDraft(db, tgId, patch){
  const existing = await getDraft(db, tgId);
  if (existing){
    const { error } = await db.from('submission_drafts').update({ ...existing, ...patch, updated_at: new Date().toISOString() }).eq('tg_id', String(tgId));
    if (error) throw error;
  } else {
    const { error } = await db.from('submission_drafts').insert({ tg_id: String(tgId), ...patch });
    if (error) throw error;
  }
}
export function getBot(){
  if (!process.env.BOT_TOKEN) throw new Error('Missing BOT_TOKEN');
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const db = getAdminClient();
  bot.start((ctx)=> ctx.reply('¡Hola! Usa /subir para proponer un modelo. /cancelar para cancelar.'));
  bot.command('cancelar', async (ctx)=>{
    await db.from('submission_drafts').delete().eq('tg_id', String(ctx.from.id));
    return ctx.reply('❌ Cancelado.');
  });
  bot.command('subir', async (ctx)=>{
    await setDraft(db, ctx.from.id, { step:'awaiting_name' });
    return ctx.reply('Dime el nombre comercial. Ej: "Redmi Note 12"');
  });
  bot.on('text', async (ctx)=>{
    const draft = await getDraft(db, ctx.from.id);
    if (!draft) return;
    const t = ctx.message.text?.trim() || '';
    switch(draft.step){
      case 'awaiting_name':
        await setDraft(db, ctx.from.id, { step:'awaiting_model', commercial_name:t });
        return ctx.reply('Modelo exacto (ej: 22111317G).');
      case 'awaiting_model':
        await setDraft(db, ctx.from.id, { step:'awaiting_works', model:t });
        return ctx.reply('¿Funciona? Responde "si" o "no".');
      case 'awaiting_works':
        await setDraft(db, ctx.from.id, { step:'awaiting_bands', works:/^s[ií]$/i.test(t) });
        return ctx.reply('Bandas (ej: LTE B3/B7).');
      case 'awaiting_bands':
        await setDraft(db, ctx.from.id, { step:'awaiting_obs', bands:t });
        return ctx.reply('Observaciones (opcional). Cuando termines escribe "ok".');
      case 'awaiting_obs':
        const obs = /^ok$/i.test(t) ? '' : t;
        await setDraft(db, ctx.from.id, { step:'confirm', observations: obs });
        return ctx.reply('¿Confirmar envío? Responde "si" o "cancelar".');
      case 'confirm':
        if (/^s[ií]$/i.test(t)){
          const { data: d } = await db.from('submission_drafts').select('*').eq('tg_id', String(ctx.from.id)).maybeSingle();
          await db.from('phones').insert({ commercial_name:d.commercial_name, model:d.model, works:d.works, bands:d.bands, observations:d.observations });
          await db.from('submission_drafts').delete().eq('tg_id', String(ctx.from.id));
          return ctx.reply('✅ Enviado. ¡Gracias!');
        } else {
          await db.from('submission_drafts').delete().eq('tg_id', String(ctx.from.id));
          return ctx.reply('❌ Cancelado.');
        }
    }
  });
  return bot;
}
