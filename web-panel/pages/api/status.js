
import { getAdminClient } from '../../lib/supabase';

async function checkBotStatus() {
  try {
    // Verificar si hay un webhook configurado en Supabase
    const db = getAdminClient();
    const { data: webhookData, error } = await db
      .from('bot_config')
      .select('webhook_url, bot_token, is_active')
      .eq('is_active', true)
      .single();
    
    if (error || !webhookData) {
      return { 
        online: false, 
        reason: 'No bot configuration found',
        hasBotToken: false,
        webhookSet: false
      };
    }

    // Verificar si el webhook está configurado
    const webhookSet = !!webhookData.webhook_url;
    const hasBotToken = !!webhookData.bot_token;

    // Verificar actividad reciente del bot
    const since = new Date(Date.now() - 24*60*60*1000).toISOString(); // últimas 24h
    const { data: recentEvents, error: eventsError } = await db
      .from('events')
      .select('id')
      .gte('created_at', since)
      .limit(1);

    const hasRecentActivity = !eventsError && recentEvents && recentEvents.length > 0;

    // El bot está online si tiene token y webhook configurado, independientemente de la actividad reciente
    const isOnline = hasBotToken && webhookSet;
    
    return {
      online: isOnline,
      reason: !hasBotToken ? 'No bot token' : !webhookSet ? 'Webhook not set' : hasRecentActivity ? 'Active' : 'Configured but no recent activity',
      hasBotToken,
      webhookSet,
      hasRecentActivity,
      webhookUrl: webhookData.webhook_url
    };
  } catch (error) {
    return {
      online: false,
      reason: `Error checking bot: ${error.message}`,
      hasBotToken: false,
      webhookSet: false
    };
  }
}

export default async function handler(req, res) {
  const [botStatus, dbStatus] = await Promise.all([
    checkBotStatus(),
    checkDatabaseStatus()
  ]);

  res.status(200).json({
    bot: botStatus,
    db: dbStatus,
    timestamp: new Date().toISOString()
  });
}

async function checkDatabaseStatus() {
  try {
    const db = getAdminClient();
    const { error } = await db.from('phones').select('id', { count: 'exact', head: true });
    
    if (error) {
      return { ok: false, reason: error.message };
    }

    // Verificar usuarios activos en las últimas 7 días
    const since = new Date(Date.now() - 7*24*60*60*1000).toISOString();
    const { data: events, error: eventsError } = await db
      .from('events')
      .select('tg_id')
      .gte('created_at', since);

    const activeUsers = eventsError ? 0 : new Set((events || []).map(x => x.tg_id).filter(Boolean)).size;

    return {
      ok: true,
      reason: '',
      activeUsers
    };
  } catch (error) {
    return {
      ok: false,
      reason: String(error?.message || error),
      activeUsers: 0
    };
  }
}
