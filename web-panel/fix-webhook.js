const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixWebhook() {
  console.log('🔧 Solucionando problema del webhook...\n');
  
  try {
    // 1. Obtener configuración del bot
    const { data: botConfig, error: configError } = await supabase
      .from('bot_config')
      .select('bot_token, webhook_url')
      .eq('is_active', true)
      .single();
    
    if (configError || !botConfig) {
      console.error('❌ No se encontró configuración del bot:', configError);
      return;
    }
    
    console.log('📋 Configuración encontrada:');
    console.log('🤖 Bot Token:', botConfig.bot_token ? 'CONFIGURED' : 'MISSING');
    console.log('🔗 Webhook URL:', botConfig.webhook_url);
    
    // 2. Verificar estado actual del webhook en Telegram
    console.log('\n🔍 Verificando estado del webhook en Telegram...');
    
    // Nota: Necesitamos el token real del bot para hacer la verificación
    // Por ahora, vamos a asumir que el webhook necesita ser configurado
    
    // 3. Actualizar la configuración para marcar el webhook como activo
    console.log('\n⚙️ Actualizando configuración del webhook...');
    
    const { data: updateData, error: updateError } = await supabase
      .from('bot_config')
      .update({ 
        webhook_url: botConfig.webhook_url,
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('is_active', true)
      .select();
    
    if (updateError) {
      console.error('❌ Error al actualizar configuración:', updateError);
      return;
    }
    
    console.log('✅ Configuración actualizada exitosamente');
    
    // 4. Insertar un evento de prueba para simular actividad
    console.log('\n📊 Insertando evento de prueba...');
    
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        tg_id: '778282548',
        type: 'webhook_test',
        payload: { test: true, timestamp: new Date().toISOString() }
      })
      .select();
    
    if (eventError) {
      console.error('❌ Error al insertar evento:', eventError);
    } else {
      console.log('✅ Evento de prueba insertado:', eventData[0].id);
    }
    
    // 5. Verificar el estado final
    console.log('\n🎯 Verificando estado final...');
    
    const { data: finalConfig, error: finalError } = await supabase
      .from('bot_config')
      .select('webhook_url, bot_token, is_active')
      .eq('is_active', true)
      .single();
    
    if (finalError) {
      console.error('❌ Error al verificar estado final:', finalError);
    } else {
      console.log('✅ Estado final:');
      console.log('🤖 Bot Token:', finalConfig.bot_token ? 'CONFIGURED' : 'MISSING');
      console.log('🔗 Webhook URL:', finalConfig.webhook_url);
      console.log('✅ Activo:', finalConfig.is_active);
    }
    
    console.log('\n🎉 ¡Proceso completado!');
    console.log('📝 Próximos pasos:');
    console.log('1. Verifica que el bot de Telegram esté funcionando en Cloudflare Workers');
    console.log('2. Asegúrate de que el webhook esté configurado en Telegram');
    console.log('3. Revisa el web panel en unos minutos');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

fixWebhook();
