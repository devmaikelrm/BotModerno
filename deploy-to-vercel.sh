#!/bin/bash

# Script de despliegue automatizado para Vercel
# Este script automatiza todo el proceso de despliegue de tu proyecto BotModerno

echo "=== Script de Despliegue Automatizado para Vercel ==="
echo ""

# Verificar si Vercel CLI está instalado
echo "Verificando si Vercel CLI está instalado..."
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI no encontrado. Instalando..."
    npm install -g vercel
else
    echo "Vercel CLI ya está instalado."
fi

echo ""
echo "Iniciando proceso de despliegue..."
echo ""

# Solicitar credenciales de Telegram
echo "=== Configuración de Telegram ==="
read -p "Ingresa tu BOT_TOKEN de Telegram: " BOT_TOKEN
read -p "Ingresa los ADMIN_TG_IDS (separados por comas): " ADMIN_TG_IDS
read -p "Ingresa los ALLOWED_CHAT_IDS (separados por comas): " ALLOWED_CHAT_IDS

echo ""
echo "=== Configuración del Panel de Administración ==="
read -p "Nombre de usuario para el panel de administración: " DASHBOARD_USER
read -sp "Contraseña para el panel de administración: " DASHBOARD_PASS
echo ""

echo ""
echo "=== Configuración de Supabase ==="
read -p "Ingresa tu SUPABASE_URL: " SUPABASE_URL
read -sp "Ingresa tu SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
echo ""
read -sp "Ingresa tu SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
echo ""

echo ""
echo "Iniciando sesión en Vercel..."
vercel login

echo ""
echo "Creando proyecto en Vercel..."
vercel --cwd web-panel --yes

echo ""
echo "Configurando variables de entorno..."
vercel env add BOT_TOKEN production --cwd web-panel <<< "$BOT_TOKEN"
vercel env add ADMIN_TG_IDS production --cwd web-panel <<< "$ADMIN_TG_IDS"
vercel env add ALLOWED_CHAT_IDS production --cwd web-panel <<< "$ALLOWED_CHAT_IDS"
vercel env add SUPABASE_URL production --cwd web-panel <<< "$SUPABASE_URL"
vercel env add SUPABASE_ANON_KEY production --cwd web-panel <<< "$SUPABASE_ANON_KEY"
vercel env add SUPABASE_SERVICE_ROLE_KEY production --cwd web-panel <<< "$SUPABASE_SERVICE_ROLE_KEY"
vercel env add NEXT_PUBLIC_SUPABASE_URL production --cwd web-panel <<< "$SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --cwd web-panel <<< "$SUPABASE_ANON_KEY"
vercel env add DASHBOARD_USER production --cwd web-panel <<< "$DASHBOARD_USER"
vercel env add DASHBOARD_PASS production --cwd web-panel <<< "$DASHBOARD_PASS"

echo ""
echo "Realizando despliegue inicial..."
vercel --cwd web-panel --prod

echo ""
echo "=== ¡Despliegue completado! ==="
echo ""
echo "Tu proyecto ha sido desplegado exitosamente en Vercel."
echo "Puedes acceder a tu aplicación en la URL proporcionada por Vercel."
echo ""
echo "Para configurar el webhook de Telegram automáticamente, visita:"
echo "https://<tu-dominio-vercel>/api/run-setup"
echo ""
echo "¡Disfruta de tu aplicación desplegada!"