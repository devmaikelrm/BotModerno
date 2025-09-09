import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function BotConfig() {
  const [config, setConfig] = useState({
    welcome: '',
    rules: '',
    shortWelcome: true,
    captchaEnabled: true,
    captchaTimeout: 120,
    autoApproveJoin: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('bot_config')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading config:', error);
        setMessage('Error cargando configuración');
        return;
      }

      setConfig({
        welcome: data.welcome || '',
        rules: data.rules || '',
        shortWelcome: data.short_welcome !== false,
        captchaEnabled: data.captcha_enabled !== false,
        captchaTimeout: data.captcha_timeout || 120,
        autoApproveJoin: data.auto_approve_join !== false
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error cargando configuración');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('bot_config')
        .update({
          welcome: config.welcome,
          rules: config.rules,
          short_welcome: config.shortWelcome,
          captcha_enabled: config.captchaEnabled,
          captcha_timeout: config.captchaTimeout,
          auto_approve_join: config.autoApproveJoin,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (error) {
        console.error('Error saving config:', error);
        setMessage('Error guardando configuración');
        return;
      }

      setMessage('✅ Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error guardando configuración');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    setConfig({
      welcome: `🎉 ¡BIENVENIDO A CUBAMODEL! 🇨🇺📱

╔══════════════════════════════════════╗
║        📱 BASE DE DATOS ABIERTA      ║
║         PARA TELÉFONOS EN CUBA       ║
╚══════════════════════════════════════╝

🌟 Este proyecto nació porque antes intentaron 
   cobrar por una base que la comunidad creó gratis.
   
✨ Aquí todo es distinto: la información será 
   SIEMPRE abierta y descargable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  LIMITACIONES ACTUALES:
┌─────────────────────────────────────┐
│ • Puede ir lento en horas pico      │
│ • Hay topes de consultas            │
│ • Puede fallar (fase desarrollo)    │
└─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📜 NUESTRAS REGLAS:
┌─────────────────────────────────────┐
│ 1️⃣ Respeto; nada de insultos       │
│ 2️⃣ No ventas, solo compatibilidad  │
│ 3️⃣ Aporta datos reales con /subir  │
│ 4️⃣ Usa /reportar para errores      │
│ 5️⃣ La base es de todos             │
└─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 COMANDOS DISPONIBLES:
┌─────────────────────────────────────┐
│ /subir    → Agregar teléfono        │
│ /buscar   → Buscar por modelo       │
│ /reportar → Reportar problema       │
│ /reglas   → Ver reglas completas    │
│ /ayuda    → Ver ayuda               │
└─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💫 Gracias por sumarte. 
   Esto es de todos y para todos. ✨

🇨🇺 ¡Vamos a hacer la mejor base de datos 
    de compatibilidad de teléfonos en Cuba! 🇨🇺`,
      rules: `1) Respeto; nada de insultos ni spam.
2) No ventas, solo compatibilidad de teléfonos en Cuba.
3) Aporta datos reales con /subir.
4) Usa /reportar para avisar de errores.
5) La base es de todos, nadie puede privatizarla.`,
      shortWelcome: true,
      captchaEnabled: true,
      captchaTimeout: 120,
      autoApproveJoin: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            🤖 Configuración del Bot
          </h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            {/* Mensaje de Bienvenida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Mensaje de Bienvenida
              </label>
              <textarea
                value={config.welcome}
                onChange={(e) => setConfig({...config, welcome: e.target.value})}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe el mensaje de bienvenida aquí..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Este mensaje se enviará cuando los usuarios usen /start
              </p>
            </div>

            {/* Reglas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📜 Reglas del Bot
              </label>
              <textarea
                value={config.rules}
                onChange={(e) => setConfig({...config, rules: e.target.value})}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe las reglas aquí..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Estas reglas se mostrarán cuando los usuarios usen /reglas
              </p>
            </div>

            {/* Configuraciones de Moderación */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🛡️ Configuración de Moderación
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shortWelcome"
                    checked={config.shortWelcome}
                    onChange={(e) => setConfig({...config, shortWelcome: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="shortWelcome" className="ml-2 text-sm text-gray-700">
                    Mostrar bienvenida corta en grupos
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="captchaEnabled"
                    checked={config.captchaEnabled}
                    onChange={(e) => setConfig({...config, captchaEnabled: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="captchaEnabled" className="ml-2 text-sm text-gray-700">
                    Habilitar verificación captcha
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoApproveJoin"
                    checked={config.autoApproveJoin}
                    onChange={(e) => setConfig({...config, autoApproveJoin: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoApproveJoin" className="ml-2 text-sm text-gray-700">
                    Aprobar automáticamente solicitudes de unión
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ⏰ Tiempo límite del captcha (segundos)
                  </label>
                  <input
                    type="number"
                    value={config.captchaTimeout}
                    onChange={(e) => setConfig({...config, captchaTimeout: parseInt(e.target.value)})}
                    min="60"
                    max="300"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="border-t pt-6 flex flex-wrap gap-4">
              <button
                onClick={saveConfig}
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {saving ? 'Guardando...' : '💾 Guardar Configuración'}
              </button>

              <button
                onClick={resetToDefault}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                🔄 Restaurar por Defecto
              </button>

              <button
                onClick={loadConfig}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                🔄 Recargar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}