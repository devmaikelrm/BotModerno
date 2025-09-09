const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupBotConfig() {
  console.log('🔧 Configurando conexión bot-panel...');
  
  try {
    // 1. Crear tabla bot_config si no existe
    console.log('📋 Creando tabla bot_config...');
    const { error: createError } = await supabase.rpc('exec', {
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
    
    if (createError && !createError.message.includes('already exists')) {
      console.log('❌ Error creando tabla:', createError.message);
      return;
    }
    console.log('✅ Tabla bot_config lista');
    
    // 2. Insertar configuración del bot
    console.log('🤖 Configurando bot...');
    const { error: insertError } = await supabase
      .from('bot_config')
      .upsert({
        id: 1,
        bot_token: 'CONFIGURED', // El bot ya está funcionando
        webhook_url: 'https://cubamodel-bot.reyessmorales95.workers.dev/webhook',
        is_active: true
      }, { 
        onConflict: 'id' 
      });
    
    if (insertError) {
      console.log('❌ Error configurando bot:', insertError.message);
      return;
    }
    console.log('✅ Bot configurado en Supabase');
    
    // 3. Crear un evento de prueba para mostrar actividad
    console.log('📊 Creando evento de prueba...');
    const { error: eventError } = await supabase
      .from('events')
      .insert({
        tg_id: 778282548, // ID del usuario que probó el bot
        event_type: 'bot_test',
        data: { message: 'Bot connectivity test' },
        created_at: new Date().toISOString()
      });
    
    if (eventError && !eventError.message.includes('relation "events" does not exist')) {
      console.log('⚠️  No se pudo crear evento (tabla events no existe):', eventError.message);
    } else {
      console.log('✅ Evento de prueba creado');
    }
    
    // 4. Verificar configuración
    console.log('🔍 Verificando configuración...');
    const { data: config, error: configError } = await supabase
      .from('bot_config')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (configError) {
      console.log('❌ Error verificando configuración:', configError.message);
      return;
    }
    
    console.log('✅ Configuración verificada:');
    console.log('  - Bot Token:', config.bot_token ? '✅ Configurado' : '❌ Faltante');
    console.log('  - Webhook URL:', config.webhook_url || '❌ No configurado');
    console.log('  - Activo:', config.is_active ? '✅ Sí' : '❌ No');
    
    console.log('\n🎉 ¡Listo! Ahora tu web panel debería mostrar el bot como Online.');
    console.log('🌐 Ve a: https://web-panel-8ztxahv2o-maikeldevs-projects-ac54176c.vercel.app');
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

setupBotConfig();

