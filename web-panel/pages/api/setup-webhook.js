import { getAdminClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔧 Configurando webhook...');
    
    // 1. Obtener configuración del bot
    const db = getAdminClient();
    const { data: botConfig, error: configError } = await db
      .from('bot_config')
      .select('bot_token, webhook_url')
      .eq('is_active', true)
      .single();
    
    if (configError || !botConfig) {
      return res.status(400).json({ 
        success: false, 
        error: 'No bot configuration found' 
      });
    }
    
    console.log('📋 Bot config encontrada:', {
      hasToken: !!botConfig.bot_token,
      webhookUrl: botConfig.webhook_url
    });
    
    // 2. Configurar webhook en Telegram
    const webhookUrl = botConfig.webhook_url;
    const botToken = process.env.BOT_TOKEN; // Token real del bot
    
    if (!botToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Bot token not found in environment variables' 
      });
    }
    
    console.log('🔗 Configurando webhook en Telegram...');
    
    // Primero eliminar webhook existente
    const deleteResponse = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`, {
      method: 'POST'
    });
    
    const deleteResult = await deleteResponse.json();
    console.log('🗑️ Delete webhook result:', deleteResult);
    
    // Luego configurar nuevo webhook
    const setResponse = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query']
      })
    });
    
    const setResult = await setResponse.json();
    console.log('✅ Set webhook result:', setResult);
    
    if (!setResult.ok) {
      return res.status(400).json({ 
        success: false, 
        error: `Failed to set webhook: ${setResult.description}` 
      });
    }
    
    // 3. Verificar que el webhook esté configurado
    const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const infoResult = await infoResponse.json();
    
    console.log('📊 Webhook info:', infoResult);
    
    // 4. Actualizar estado en la base de datos
    const { error: updateError } = await db
      .from('bot_config')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('is_active', true);
    
    if (updateError) {
      console.error('⚠️ Error updating database:', updateError);
    }
    
    // 5. Insertar evento de configuración
    await db
      .from('events')
      .insert({
        tg_id: 'system',
        type: 'webhook_configured',
        payload: { 
          webhook_url: webhookUrl,
          timestamp: new Date().toISOString()
        }
      });
    
    return res.status(200).json({
      success: true,
      message: 'Webhook configured successfully',
      webhookInfo: infoResult.result,
      webhookUrl: webhookUrl
    });
    
  } catch (error) {
    console.error('❌ Error configuring webhook:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
