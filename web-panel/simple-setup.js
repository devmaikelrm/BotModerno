const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleSetup() {
  console.log('🔧 Configurando bot en Supabase...');
  
  try {
    // Intentar insertar configuración directamente
    console.log('🤖 Insertando configuración del bot...');
    const { data, error } = await supabase
      .from('bot_config')
      .insert({
        bot_token: 'CONFIGURED',
        webhook_url: 'https://cubamodel-bot.reyessmorales95.workers.dev/webhook',
        is_active: true
      })
      .select();
    
    if (error) {
      if (error.message.includes('relation "bot_config" does not exist')) {
        console.log('❌ La tabla bot_config no existe.');
        console.log('📝 Necesitas crearla manualmente en Supabase:');
        console.log('');
        console.log('1. Ve a: https://supabase.com/dashboard/project/dlnqkmcacfwhbwdjxczw/editor');
        console.log('2. Ejecuta este SQL:');
        console.log('');
        console.log('CREATE TABLE bot_config (');
        console.log('  id SERIAL PRIMARY KEY,');
        console.log('  bot_token TEXT,');
        console.log('  webhook_url TEXT,');
        console.log('  is_active BOOLEAN DEFAULT true,');
        console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
        console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
        console.log(');');
        console.log('');
        console.log('3. Luego ejecuta:');
        console.log('INSERT INTO bot_config (bot_token, webhook_url, is_active)');
        console.log("VALUES ('CONFIGURED', 'https://cubamodel-bot.reyessmorales95.workers.dev/webhook', true);");
        return;
      } else {
        console.log('❌ Error:', error.message);
        return;
      }
    }
    
    console.log('✅ Bot configurado exitosamente!');
    console.log('🎉 Tu web panel ahora debería mostrar el bot como Online.');
    console.log('🌐 Ve a: https://web-panel-8ztxahv2o-maikeldevs-projects-ac54176c.vercel.app');
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

simpleSetup();

