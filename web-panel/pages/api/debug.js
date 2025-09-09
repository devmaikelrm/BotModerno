import { getAdminClient } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    console.log('🔍 Debug endpoint called');
    
    // Verificar variables de entorno
    const envCheck = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: process.env.NODE_ENV
    };
    
    console.log('📋 Environment variables:', envCheck);
    
    // Verificar conexión a Supabase
    let supabaseConnection = false;
    let supabaseError = null;
    
    try {
      const db = getAdminClient();
      const { error } = await db.from('bot_config').select('id', { count: 'exact', head: true });
      supabaseConnection = !error;
      supabaseError = error?.message || null;
    } catch (err) {
      supabaseError = err.message;
    }
    
    // Verificar configuración del bot
    let botConfig = null;
    let botConfigError = null;
    
    try {
      const db = getAdminClient();
      const { data, error } = await db
        .from('bot_config')
        .select('webhook_url, bot_token, is_active')
        .eq('is_active', true)
        .single();
      
      botConfig = data;
      botConfigError = error?.message || null;
    } catch (err) {
      botConfigError = err.message;
    }
    
    // Verificar eventos recientes
    let recentEvents = null;
    let eventsError = null;
    
    try {
      const db = getAdminClient();
      const since = new Date(Date.now() - 24*60*60*1000).toISOString();
      const { data, error } = await db
        .from('events')
        .select('id, created_at, type')
        .gte('created_at', since)
        .limit(5);
      
      recentEvents = data;
      eventsError = error?.message || null;
    } catch (err) {
      eventsError = err.message;
    }
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      supabase: {
        connected: supabaseConnection,
        error: supabaseError
      },
      botConfig: {
        data: botConfig,
        error: botConfigError
      },
      events: {
        data: recentEvents,
        error: eventsError,
        count: recentEvents?.length || 0
      }
    };
    
    console.log('📊 Debug info:', JSON.stringify(debugInfo, null, 2));
    
    res.status(200).json(debugInfo);
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
