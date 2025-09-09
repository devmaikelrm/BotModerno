import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBotConfig() {
  console.log('🔍 Verificando configuración del bot...');
  
  try {
    // Verificar si existe la tabla bot_config
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'bot_config');
    
    if (tablesError) {
      console.log('❌ Error verificando tablas:', tablesError.message);
      return;
    }
    
    if (!tables || tables.length === 0) {
      console.log('❌ La tabla bot_config no existe. Creándola...');
      
      // Crear la tabla bot_config
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS bot_config (
            id SERIAL PRIMARY KEY,
            bot_token TEXT,
            webhook_url TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (createError) {
        console.log('❌ Error creando tabla:', createError.message);
        return;
      }
      
      console.log('✅ Tabla bot_config creada');
    } else {
      console.log('✅ Tabla bot_config existe');
    }
    
    // Verificar configuración actual
    const { data: config, error: configError } = await supabase
      .from('bot_config')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (configError && configError.code !== 'PGRST116') {
      console.log('❌ Error obteniendo configuración:', configError.message);
      return;
    }
    
    if (!config) {
      console.log('❌ No hay configuración activa del bot');
      console.log('📝 Creando configuración por defecto...');
      
      const { error: insertError } = await supabase
        .from('bot_config')
        .insert({
          bot_token: 'YOUR_BOT_TOKEN_HERE',
          webhook_url: 'https://cubamodel-bot.reyessmorales95.workers.dev/webhook',
          is_active: true
        });
      
      if (insertError) {
        console.log('❌ Error insertando configuración:', insertError.message);
        return;
      }
      
      console.log('✅ Configuración por defecto creada');
      console.log('⚠️  IMPORTANTE: Actualiza el bot_token en Supabase con tu token real');
    } else {
      console.log('✅ Configuración encontrada:');
      console.log('  - Bot Token:', config.bot_token ? '✅ Configurado' : '❌ Faltante');
      console.log('  - Webhook URL:', config.webhook_url || '❌ No configurado');
      console.log('  - Activo:', config.is_active ? '✅ Sí' : '❌ No');
    }
    
    // Verificar tabla events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (eventsError) {
      console.log('❌ Error verificando eventos:', eventsError.message);
    } else {
      console.log('📊 Eventos recientes:', events?.length || 0);
      if (events && events.length > 0) {
        console.log('  Último evento:', events[0].created_at);
      }
    }
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

checkBotConfig();
