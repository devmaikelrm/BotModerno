const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'dlnqkmcacfwhbwdjxczw.supabase.co',
      port: 443,
      path: `/rest/v1/${path}`,
      method: method,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ data: result, error: null });
        } catch (e) {
          resolve({ data: body, error: null });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function setupBot() {
  console.log('🚀 Configuración automática del bot...');
  
  try {
    // 1. Intentar insertar configuración directamente
    console.log('🤖 Configurando bot...');
    const { data, error } = await makeRequest('bot_config', 'POST', {
      bot_token: 'CONFIGURED',
      webhook_url: 'https://cubamodel-bot.reyessmorales95.workers.dev/webhook',
      is_active: true
    });
    
    if (error || (data && data.error)) {
      console.log('⚠️  Error insertando (tabla puede no existir):', data?.error || error);
      console.log('\n📝 Necesitas crear la tabla manualmente:');
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
    }
    
    console.log('✅ Bot configurado exitosamente!');
    console.log('🎉 Tu web panel ahora debería mostrar el bot como Online.');
    console.log('🌐 Ve a: https://web-panel-8ztxahv2o-maikeldevs-projects-ac54176c.vercel.app');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

setupBot();

