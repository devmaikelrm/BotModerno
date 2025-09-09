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
echo "<TU_BOT_TOKEN>" | npx wrangler secret put BOT_TOKEN
echo "<TU_SUPABASE_URL>" | npx wrangler secret put SUPABASE_URL
echo "<TU_SUPABASE_SERVICE_ROLE_KEY>" | npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
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
BOT_TOKEN=<TU_BOT_TOKEN>
SUPABASE_URL=<TU_SUPABASE_URL>
SUPABASE_SERVICE_ROLE_KEY=<TU_SUPABASE_SERVICE_ROLE_KEY>
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