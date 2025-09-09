const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBotStatus() {
  try {
    console.log('🔍 Verificando estado del bot...\n');
    
    // Verificar si hay un webhook configurado en Supabase
    const { data: webhookData, error } = await supabase
      .from('bot_config')
      .select('webhook_url, bot_token, is_active')
      .eq('is_active', true)
      .single();
    
    console.log('📋 Datos del webhook:', webhookData);
    console.log('❌ Error:', error);
    
    if (error || !webhookData) {
      console.log('❌ RESULTADO: Bot OFFLINE - No bot configuration found');
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

    console.log('🔗 Webhook configurado:', webhookSet);
    console.log('🤖 Token del bot:', hasBotToken);

    // Verificar actividad reciente del bot
    const since = new Date(Date.now() - 24*60*60*1000).toISOString(); // últimas 24h
    console.log('⏰ Buscando eventos desde:', since);
    
    const { data: recentEvents, error: eventsError } = await supabase
      .from('events')
      .select('id')
      .gte('created_at', since)
      .limit(1);

    console.log('📊 Eventos recientes:', recentEvents);
    console.log('❌ Error eventos:', eventsError);

    const hasRecentActivity = !eventsError && recentEvents && recentEvents.length > 0;
    console.log('🎯 Actividad reciente:', hasRecentActivity);

    // El bot está online si tiene token y webhook configurado, independientemente de la actividad reciente
    const isOnline = hasBotToken && webhookSet;
    
    console.log('\n🎯 RESULTADO FINAL:');
    console.log('✅ Bot Online:', isOnline);
    console.log('📝 Razón:', !hasBotToken ? 'No bot token' : !webhookSet ? 'Webhook not set' : hasRecentActivity ? 'Active' : 'Configured but no recent activity');
    
    return {
      online: isOnline,
      reason: !hasBotToken ? 'No bot token' : !webhookSet ? 'Webhook not set' : hasRecentActivity ? 'Active' : 'Configured but no recent activity',
      hasBotToken,
      webhookSet,
      hasRecentActivity,
      webhookUrl: webhookData.webhook_url
    };
  } catch (error) {
    console.log('❌ ERROR GENERAL:', error);
    return {
      online: false,
      reason: `Error checking bot: ${error.message}`,
      hasBotToken: false,
      webhookSet: false
    };
  }
}

checkBotStatus();
