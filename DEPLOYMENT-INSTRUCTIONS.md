# 🚀 Instrucciones de Deployment - CubaModel Bot

## ✅ Estado Actual
- ✅ Bot migrado a Cloudflare Workers (sin dependencias de Vercel)
- ✅ Base de datos Supabase configurada con RLS
- ✅ Lógica del bot adaptada: `/revisar` solo en grupos, otros comandos en DM
- ✅ GitHub Actions configurado
- ✅ Bot simplificado compatible con Cloudflare Workers

## 🔑 Paso 1: Obtener Token de Cloudflare

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Usa la plantilla "Custom token" con estos permisos:
   - **Zone**: Zone:Read, Zone:Zone:Read
   - **Account**: Cloudflare Workers:Edit
   - **Zone Resources**: All zones

## 📦 Paso 2: Deployment Manual

```bash
# Configura tu token de Cloudflare
export CLOUDFLARE_API_TOKEN="tu_token_aqui"

# Deploy el worker
npx wrangler deploy

# Configura los secretos uno por uno
echo "8212689812:AAGFe0uktu_mG0A3rDkyP-PAcdtOa9ipHjU" | npx wrangler secret put BOT_TOKEN
echo "https://dlnqkmcacfwhbwdjxczw.supabase.co" | npx wrangler secret put SUPABASE_URL
echo "tu_supabase_service_key" | npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
echo "tu_admin_ids" | npx wrangler secret put ADMIN_TG_IDS
echo "tu_allowed_chat_ids" | npx wrangler secret put ALLOWED_CHAT_IDS
```

## 🔗 Paso 3: Configurar Webhook

Una vez deployado, tu bot estará en:
**https://cubamodel-bot.workers.dev**

Configura el webhook visitando:
**https://cubamodel-bot.workers.dev/setup-webhook**

## ✅ Verificar Funcionamiento

- Status: https://cubamodel-bot.workers.dev/status
- Webhook: https://cubamodel-bot.workers.dev/webhook

## 🤖 Comandos del Bot

### En DM (Direct Messages):
- `/start` - Bienvenida
- `/subir` - Iniciar asistente para agregar teléfono
- `/reportar <id> <texto>` - Reportar problema
- `/suscribir` - Recibir notificaciones
- `/cancelar` - Cancelar asistente

### En Grupos:
- `/start` - Bienvenida
- `/revisar` - Ver últimos teléfonos (SOLO EN GRUPOS)
- `/suscribir` - Suscribirse a notificaciones

## 📋 GitHub Actions (Automático)

Para deployment automático, configura estos secretos en tu repo GitHub:

```
CLOUDFLARE_API_TOKEN=tu_token
CLOUDFLARE_ACCOUNT_ID=tu_account_id
BOT_TOKEN=8212689812:AAGFe0uktu_mG0A3rDkyP-PAcdtOa9ipHjU
SUPABASE_URL=https://dlnqkmcacfwhbwdjxczw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_key
ADMIN_TG_IDS=tu_admin_ids
ALLOWED_CHAT_IDS=tu_allowed_chat_ids
```

## 🎯 ¡Tu bot está listo para producción!

**Diferencias clave de la migración:**
- ❌ Eliminado: Dependencias de Vercel
- ❌ Eliminado: Telegraf (incompatible con Workers)
- ✅ Agregado: Bot simplificado con Telegram API directa
- ✅ Agregado: Lógica específica DM vs grupos
- ✅ Agregado: Cloudflare Workers deployment
- ✅ Mantenido: Todas las funcionalidades del bot
- ✅ Mantenido: Panel web Next.js (separado)
- ✅ Mantenido: Base de datos Supabase con RLS