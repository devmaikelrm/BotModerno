import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Obtener configuración del bot
      const { data, error } = await supabase
        .from('bot_config')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching bot config:', error);
        return res.status(500).json({ error: 'Error obteniendo configuración' });
      }

      return res.status(200).json({
        success: true,
        data: {
          welcome: data.welcome || '',
          rules: data.rules || '',
          shortWelcome: data.short_welcome !== false,
          captchaEnabled: data.captcha_enabled !== false,
          captchaTimeout: data.captcha_timeout || 120,
          autoApproveJoin: data.auto_approve_join !== false
        }
      });
    }

    if (req.method === 'POST') {
      // Actualizar configuración del bot
      const { welcome, rules, shortWelcome, captchaEnabled, captchaTimeout, autoApproveJoin } = req.body;

      const { data, error } = await supabase
        .from('bot_config')
        .update({
          welcome: welcome || '',
          rules: rules || '',
          short_welcome: shortWelcome !== false,
          captcha_enabled: captchaEnabled !== false,
          captcha_timeout: captchaTimeout || 120,
          auto_approve_join: autoApproveJoin !== false,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1)
        .select()
        .single();

      if (error) {
        console.error('Error updating bot config:', error);
        return res.status(500).json({ error: 'Error actualizando configuración' });
      }

      return res.status(200).json({
        success: true,
        message: 'Configuración actualizada exitosamente',
        data
      });
    }

    if (req.method === 'PUT') {
      // Crear o actualizar configuración completa
      const { welcome, rules, shortWelcome, captchaEnabled, captchaTimeout, autoApproveJoin } = req.body;

      const { data, error } = await supabase
        .from('bot_config')
        .upsert({
          id: 1,
          welcome: welcome || '',
          rules: rules || '',
          short_welcome: shortWelcome !== false,
          captcha_enabled: captchaEnabled !== false,
          captcha_timeout: captchaTimeout || 120,
          auto_approve_join: autoApproveJoin !== false,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting bot config:', error);
        return res.status(500).json({ error: 'Error guardando configuración' });
      }

      return res.status(200).json({
        success: true,
        message: 'Configuración guardada exitosamente',
        data
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('Error in bot-config API:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}