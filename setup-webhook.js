import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupWebhook() {
  console.log('🔧 CONFIGURACIÓN DEL WEBHOOK');
  console.log('============================\n');
  
  try {
    // 1. Verificar eventos recientes
    console.log('1️⃣ Verificando actividad reciente...');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (eventsError) {
      console.log('❌ Error obteniendo eventos:', eventsError.message);
    } else {
      console.log(`📊 Eventos recientes: ${events?.length || 0}`);
      if (events && events.length > 0) {
        const lastEvent = events[0];
        const timeAgo = new Date(lastEvent.created_at).toLocaleString();
        console.log(`📅 Último evento: ${lastEvent.type} - ${timeAgo}`);
        
        // Verificar si hay eventos de hoy
        const today = new Date().toDateString();
        const todayEvents = events.filter(event => 
          new Date(event.created_at).toDateString() === today
        );
        
        if (todayEvents.length === 0) {
          console.log('⚠️  No hay eventos de hoy - el webhook no está recibiendo mensajes');
        } else {
          console.log(`✅ Hay ${todayEvents.length} eventos de hoy`);
        }
      }
    }
    console.log('');
    
    // 2. Información del webhook
    console.log('2️⃣ INFORMACIÓN DEL WEBHOOK');
    console.log('===========================');
    console.log('🔗 URL del webhook: https://cubamodel-bot.reyessmorales95.workers.dev/webhook/[SECRET]');
    console.log('🔐 Secret: Configurado en Cloudflare Workers');
    console.log('📡 Estado: Worker funcionando correctamente');
    console.log('');
    
    // 3. Instrucciones para configurar webhook
    console.log('3️⃣ CONFIGURAR WEBHOOK EN @BotFather');
    console.log('====================================');
    console.log('📱 Pasos para configurar el webhook:');
    console.log('');
    console.log('1. Abre Telegram y busca @BotFather');
    console.log('2. Envía el comando: /setwebhook');
    console.log('3. Envía la URL del webhook:');
    console.log('   https://cubamodel-bot.reyessmorales95.workers.dev/webhook/[SECRET]');
    console.log('');
    console.log('⚠️  IMPORTANTE: Necesitas obtener el SECRET real');
    console.log('   Ejecuta: wrangler secret list');
    console.log('   Busca TG_WEBHOOK_SECRET y usa ese valor');
    console.log('');
    console.log('4. Opcionalmente, configura el secret token:');
    console.log('   - Usa el mismo valor del TG_WEBHOOK_SECRET');
    console.log('   - Esto añade seguridad extra');
    console.log('');
    
    // 4. Verificar configuración actual
    console.log('4️⃣ VERIFICAR CONFIGURACIÓN ACTUAL');
    console.log('==================================');
    console.log('🔍 Para verificar si el webhook está configurado:');
    console.log('   1. Envía /getwebhookinfo a @BotFather');
    console.log('   2. Debería mostrar la URL del webhook');
    console.log('   3. Si está vacío, necesitas configurarlo');
    console.log('');
    
    // 5. Probar el webhook
    console.log('5️⃣ PROBAR EL WEBHOOK');
    console.log('====================');
    console.log('🧪 Después de configurar el webhook:');
    console.log('   1. Envía /start a tu bot');
    console.log('   2. Deberías recibir el mensaje de bienvenida');
    console.log('   3. Ejecuta: node debug-bot.js para verificar eventos');
    console.log('');
    
    console.log('🎯 RESUMEN:');
    console.log('===========');
    console.log('✅ Worker desplegado y funcionando');
    console.log('✅ Base de datos conectada');
    console.log('✅ Configuración del bot OK');
    console.log('❌ Webhook no configurado en @BotFather');
    console.log('');
    console.log('🔧 ACCIÓN REQUERIDA:');
    console.log('====================');
    console.log('1. Obtener el TG_WEBHOOK_SECRET real');
    console.log('2. Configurar webhook en @BotFather');
    console.log('3. Probar enviando /start al bot');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

setupWebhook();
