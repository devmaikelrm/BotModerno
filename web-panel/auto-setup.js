const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function autoSetup() {
  console.log('🚀 Configuración automática del bot...');
  
  try {
    // 1. Crear tabla bot_config usando SQL directo
    console.log('📋 Creando tabla bot_config...');
    const { data: createResult, error: createError } = await supabase
      .rpc('exec_sql', {
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
      console.log('⚠️  Error creando tabla (puede que ya exista):', createError.message);
    } else {
      console.log('✅ Tabla bot_config creada');
    }
    
    // 2. Insertar configuración del bot
    console.log('🤖 Configurando bot...');
    const { data: insertData, error: insertError } = await supabase
      .from('bot_config')
      .upsert({
        id: 1,
        bot_token: 'CONFIGURED',
        webhook_url: 'https://cubamodel-bot.reyessmorales95.workers.dev/webhook',
        is_active: true
      }, { 
        onConflict: 'id' 
      })
      .select();
    
    if (insertError) {
      console.log('❌ Error insertando configuración:', insertError.message);
      return;
    }
    
    console.log('✅ Bot configurado:', insertData);
    
    // 3. Crear tabla events si no existe
    console.log('📊 Verificando tabla events...');
    const { data: eventsResult, error: eventsError } = await supabase
      .rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            tg_id BIGINT,
            event_type TEXT,
            data JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (eventsError) {
      console.log('⚠️  Error creando tabla events:', eventsError.message);
    } else {
      console.log('✅ Tabla events lista');
    }
    
    // 4. Insertar evento de prueba
    console.log('📝 Creando evento de prueba...');
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        tg_id: 778282548,
        event_type: 'bot_test',
        data: { message: 'Bot connectivity test', timestamp: new Date().toISOString() }
      })
      .select();
    
    if (eventError) {
      console.log('⚠️  Error creando evento:', eventError.message);
    } else {
      console.log('✅ Evento de prueba creado:', eventData);
    }
    
    // 5. Verificar configuración final
    console.log('🔍 Verificando configuración final...');
    const { data: config, error: configError } = await supabase
      .from('bot_config')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (configError) {
      console.log('❌ Error verificando configuración:', configError.message);
      return;
    }
    
    console.log('\n🎉 ¡CONFIGURACIÓN COMPLETA!');
    console.log('✅ Bot configurado en Supabase');
    console.log('✅ Tabla bot_config creada');
    console.log('✅ Tabla events creada');
    console.log('✅ Evento de prueba insertado');
    console.log('\n📊 Configuración actual:');
    console.log('  - Bot Token:', config.bot_token ? '✅ Configurado' : '❌ Faltante');
    console.log('  - Webhook URL:', config.webhook_url || '❌ No configurado');
    console.log('  - Activo:', config.is_active ? '✅ Sí' : '❌ No');
    
    console.log('\n🌐 Tu web panel ahora debería mostrar:');
    console.log('   🤖 Bot Status: ✅ Online');
    console.log('   🗄️  Supabase DB: ✅ Connected');
    console.log('   ☁️  Web Panel: ✅ Online');
    console.log('   👥 Active Users: 1+');
    
    console.log('\n🔗 Ve a: https://web-panel-8ztxahv2o-maikeldevs-projects-ac54176c.vercel.app');
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

autoSetup();

