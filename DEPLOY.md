# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar TutorIA en Vercel paso a paso.

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com) (gratuita)
2. Cuenta de Google (gratuita) para obtener la API key de Gemini
3. Repositorio Git (GitHub, GitLab o Bitbucket)

## 🔑 Paso 1: Obtener API Key de Google Gemini (GRATIS)

1. Ve a [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google (cualquier cuenta funciona)
3. Haz clic en **"Create API Key"** o **"Get API Key"**
4. Si te pide crear un proyecto, selecciona uno existente o crea uno nuevo
5. **IMPORTANTE**: Copia la clave inmediatamente
   - Formato: `AIza...` (empieza con AIza)
   - Puedes verla después, pero es mejor copiarla ahora
6. Guárdala en un lugar seguro

### 💡 Ventajas de Google Gemini

- ✅ **GRATIS** - Tier gratuito muy generoso
- ✅ **15 requests por minuto** (más que suficiente)
- ✅ **1,500 requests por día** (gratis)
- ✅ **No requiere tarjeta de crédito**
- ✅ Perfecto para hackathons

## 🌐 Paso 2: Desplegar en Vercel

### Opción A: Desde el Dashboard de Vercel (Recomendado)

1. **Preparar el repositorio:**
   ```bash
   git add .
   git commit -m "Preparado para despliegue"
   git push origin main
   ```

2. **Conectar con Vercel:**
   - Ve a [https://vercel.com](https://vercel.com)
   - Inicia sesión o crea una cuenta (puedes usar GitHub)
   - Haz clic en **"Add New..."** → **"Project"**
   - Conecta tu repositorio Git
   - Selecciona el repositorio de TutorIA

3. **Configurar el proyecto:**
   - **Framework Preset**: Next.js (se detecta automáticamente)
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `.next` (automático)
   - **Install Command**: `npm install` (automático)

4. **Agregar Variable de Entorno:**
   - En la sección **"Environment Variables"**
   - Agrega:
     - **Name**: `GOOGLE_AI_API_KEY`
     - **Value**: Pega tu API key de Google Gemini (empieza con `AIza...`)
   - Haz clic en **"Add"**

5. **Desplegar:**
   - Haz clic en **"Deploy"**
   - Espera 2-3 minutos mientras Vercel construye y despliega
   - ¡Listo! Tu app estará en `https://tu-proyecto.vercel.app`

### Opción B: Desde la Terminal (CLI)

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Iniciar sesión:**
   ```bash
   vercel login
   ```

3. **Desplegar:**
   ```bash
   vercel
   ```
   - Sigue las instrucciones en pantalla
   - Cuando pregunte por variables de entorno, agrega:
     - `GOOGLE_AI_API_KEY` = tu-api-key-de-google-aqui

4. **Desplegar a producción:**
   ```bash
   vercel --prod
   ```

## ✅ Paso 3: Verificar el Despliegue

1. Visita la URL que Vercel te proporcionó
2. Prueba la funcionalidad:
   - Ve a la página del Director
   - Busca "Juan Pérez"
   - Genera un reporte con IA
   - Si funciona, ¡todo está correcto!

## 🔧 Configuración Adicional en Vercel

### Agregar más Variables de Entorno

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega nuevas variables si es necesario
4. Haz clic en **"Save"**
5. Vercel redeployará automáticamente

### Dominio Personalizado (Opcional)

1. En tu proyecto de Vercel, ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones de DNS

## 🐛 Solución de Problemas

### Error: "Configuración de API no disponible"

**Causa**: La variable de entorno `GOOGLE_AI_API_KEY` no está configurada correctamente.

**Solución**:
1. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Verifica que `GOOGLE_AI_API_KEY` esté configurada
3. Asegúrate de que el valor sea correcto (empieza con `AIza...`)
4. Haz un nuevo deploy

### Error: "Error al generar el reporte"

**Causa**: API key inválida.

**Solución**:
1. Verifica que la API key sea correcta en Google AI Studio
2. Asegúrate de que la key empiece con `AIza...`
3. Revisa los logs en Vercel (Deployments → View Function Logs)

### El build falla

**Causa**: Dependencias o errores de TypeScript.

**Solución**:
1. Prueba localmente: `npm run build`
2. Si hay errores, corrígelos localmente primero
3. Verifica que todas las dependencias estén en `package.json`

## 📊 Monitoreo

- **Logs**: Vercel Dashboard → Deployments → Selecciona un deployment → View Function Logs
- **Analytics**: Vercel Dashboard → Analytics (requiere plan Pro)
- **Uptime**: Vercel monitorea automáticamente

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push` a tu repositorio:
- Vercel detectará los cambios automáticamente
- Creará un nuevo deployment
- Si todo está bien, lo desplegará a producción

## 💰 Costos

- **Vercel**: Plan gratuito es suficiente para hackathons
- **Anthropic**: Créditos gratuitos iniciales, luego pay-as-you-go

---

**¡Tu aplicación está lista para la hackathon! 🎉**

