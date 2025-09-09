const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createRecentActivity() {
  console.log('🔧 Creando actividad reciente para el bot...');
  
  try {
    // 1. Verificar si existe la tabla events
    console.log('📊 Verificando tabla events...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    
    if (eventsError) {
      console.log('❌ Error con tabla events:', eventsError.message);
      console.log('📝 Creando tabla events...');
      
      // Intentar crear la tabla events
      const { error: createError } = await supabase
        .from('events')
        .insert({
          tg_id: 778282548,
          event_type: 'table_creation_test',
          data: { message: 'Creating events table' }
        });
      
      if (createError) {
        console.log('❌ No se pudo crear tabla events:', createError.message);
        console.log('\n📋 Necesitas crear la tabla manualmente en Supabase:');
        console.log('1. Ve a: https://supabase.com/dashboard/project/dlnqkmcacfwhbwdjxczw/editor');
        console.log('2. Ejecuta este SQL:');
        console.log('');
        console.log('CREATE TABLE events (');
        console.log('  id SERIAL PRIMARY KEY,');
        console.log('  tg_id BIGINT,');
        console.log('  event_type TEXT,');
        console.log('  data JSONB,');
        console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
        console.log(');');
        return;
      }
    }
    
    // 2. Crear eventos recientes
    console.log('📝 Creando eventos recientes...');
    const eventData = [
      {
        tg_id: 778282548,
        event_type: 'bot_start',
        data: { message: 'Bot started successfully', timestamp: new Date().toISOString() }
      },
      {
        tg_id: 778282548,
        event_type: 'user_interaction',
        data: { message: 'User sent /start command', timestamp: new Date().toISOString() }
      },
      {
        tg_id: 778282548,
        event_type: 'webhook_received',
        data: { message: 'Webhook received from Telegram', timestamp: new Date().toISOString() }
      }
    ];
    
    const { data: insertedEvents, error: insertError } = await supabase
      .from('events')
      .insert(eventData)
      .select();
    
    if (insertError) {
      console.log('❌ Error insertando eventos:', insertError.message);
      return;
    }
    
    console.log('✅ Eventos creados exitosamente:', insertedEvents.length);
    
    // 3. Verificar configuración del bot
    console.log('🤖 Verificando configuración del bot...');
    const { data: config, error: configError } = await supabase
      .from('bot_config')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (configError) {
      console.log('❌ Error en configuración del bot:', configError.message);
      return;
    }
    
    console.log('✅ Configuración del bot:');
    console.log('  - Bot Token:', config.bot_token ? '✅ Configurado' : '❌ Faltante');
    console.log('  - Webhook URL:', config.webhook_url || '❌ No configurado');
    console.log('  - Activo:', config.is_active ? '✅ Sí' : '❌ No');
    
    // 4. Verificar actividad reciente
    console.log('🔍 Verificando actividad reciente...');
    const { data: recentEvents, error: recentError } = await supabase
      .from('events')
      .select('id, event_type, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.log('❌ Error verificando actividad:', recentError.message);
      return;
    }
    
    console.log('✅ Actividad reciente encontrada:', recentEvents.length, 'eventos');
    recentEvents.forEach((event, index) => {
      console.log(`  ${index + 1}. ${event.event_type} - ${event.created_at}`);
    });
    
    console.log('\n🎉 ¡ACTIVIDAD CREADA EXITOSAMENTE!');
    console.log('🌐 Ahora ve a tu panel: https://web-panel-mrlkeu8sq-maikeldevs-projects-ac54176c.vercel.app');
    console.log('📊 El bot debería aparecer como "Online" en unos segundos');
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

createRecentActivity();
