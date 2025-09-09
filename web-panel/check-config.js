const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConfig() {
  console.log('🔍 Verificando configuración del bot...\n');
  
  try {
    // Verificar todos los registros en bot_config
    const { data: allConfigs, error: allError } = await supabase
      .from('bot_config')
      .select('*');
    
    if (allError) {
      console.error('❌ Error al obtener configuraciones:', allError);
      return;
    }
    
    console.log('📋 Todas las configuraciones en bot_config:');
    console.log(JSON.stringify(allConfigs, null, 2));
    console.log('\n');
    
    // Verificar configuración activa
    const { data: activeConfig, error: activeError } = await supabase
      .from('bot_config')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (activeError) {
      console.log('⚠️ No hay configuración activa:', activeError.message);
    } else {
      console.log('✅ Configuración activa encontrada:');
      console.log(JSON.stringify(activeConfig, null, 2));
    }
    
    // Verificar eventos recientes
    const since = new Date(Date.now() - 24*60*60*1000).toISOString();
    const { data: recentEvents, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .gte('created_at', since)
      .limit(5);
    
    console.log('\n📊 Eventos recientes (últimas 24h):');
    if (eventsError) {
      console.error('❌ Error al obtener eventos:', eventsError);
    } else {
      console.log(`Encontrados ${recentEvents?.length || 0} eventos:`);
      console.log(JSON.stringify(recentEvents, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkConfig();
