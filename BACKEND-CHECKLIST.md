# ✅ Checklist del Backend - Lo Esencial

## 🔑 1. API Key de Anthropic (CRÍTICO)

### ✅ Debe estar configurada:

**Localmente:**
- [ ] Archivo `.env.local` existe en la raíz del proyecto
- [ ] Contiene: `ANTHROPIC_API_KEY=sk-ant-...`
- [ ] La key es válida (empieza con `sk-ant-`)

**En Vercel:**
- [ ] Variable de entorno `ANTHROPIC_API_KEY` está configurada
- [ ] El valor es correcto
- [ ] Se aplicó a todos los ambientes (Production, Preview, Development)

### ⚠️ Cómo verificar:
```bash
# Localmente, reinicia el servidor después de agregar la key
npm run dev

# En Vercel, verifica en:
# Settings → Environment Variables
```

---

## 📡 2. Endpoint Funcional

### ✅ El endpoint debe responder:

**URL:** `POST /api/generate-report`

**Prueba rápida:**
```bash
# Con el servidor corriendo (npm run dev)
curl -X POST http://localhost:3000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{"studentName":"Test","incidencias":[{"tipo":"ausencia","descripcion":"Test","fecha":"2024-12-15","profesor":"Test"}]}'
```

**Debe devolver:**
- Status 200 (si todo está bien)
- JSON con `report` y `timestamp`

---

## 🔄 3. Flujo Completo

### ✅ Verificar que funciona end-to-end:

1. **Frontend envía datos:**
   - [ ] El frontend llama a `/api/generate-report`
   - [ ] Envía `studentName` y `incidencias` en el body

2. **Backend procesa:**
   - [ ] Valida que hay incidencias
   - [ ] Valida que hay `studentName`
   - [ ] Construye el prompt correctamente
   - [ ] Llama a Claude API con la key correcta

3. **Claude responde:**
   - [ ] La API key es válida
   - [ ] Hay créditos disponibles
   - [ ] El modelo `claude-3-sonnet-20240229` está disponible

4. **Backend devuelve:**
   - [ ] Extrae el texto de la respuesta
   - [ ] Devuelve JSON con `report` y `timestamp`

---

## 🐛 4. Errores Comunes y Soluciones

### ❌ Error: "Configuración de API no disponible"

**Causa:** `ANTHROPIC_API_KEY` no está configurada

**Solución:**
```bash
# 1. Crea/verifica .env.local
echo "ANTHROPIC_API_KEY=sk-ant-tu-key" > .env.local

# 2. Reinicia el servidor
npm run dev
```

---

### ❌ Error: "Error al generar el reporte con IA"

**Posibles causas:**

1. **API key inválida:**
   - Verifica en [Anthropic Console](https://console.anthropic.com/)
   - Genera una nueva si es necesario

2. **Sin créditos:**
   - Ve a Anthropic Console → Billing
   - Agrega créditos si es necesario

3. **Modelo incorrecto:**
   - El código usa: `claude-3-sonnet-20240229`
   - Verifica que este modelo esté disponible en tu cuenta

**Solución:**
```bash
# Revisa los logs del servidor para más detalles
# En Vercel: Deployments → View Function Logs
```

---

### ❌ Error 401 (Unauthorized)

**Causa:** API key incorrecta o expirada

**Solución:**
1. Ve a [Anthropic Console](https://console.anthropic.com/)
2. Genera una nueva API key
3. Actualiza `.env.local` y Vercel

---

### ❌ Error 429 (Rate Limit)

**Causa:** Demasiadas solicitudes

**Solución:**
- Espera unos minutos
- Verifica tu plan en Anthropic
- Considera implementar rate limiting en el backend

---

## 📊 5. Monitoreo

### ✅ Verificar que todo funciona:

**Localmente:**
```bash
# 1. Inicia el servidor
npm run dev

# 2. Abre http://localhost:3000
# 3. Ve a /director
# 4. Busca "Juan Pérez"
# 5. Haz clic en "Generar Reporte con IA"
# 6. Debe aparecer un reporte generado por IA
```

**En Vercel:**
1. Ve a tu proyecto
2. **Deployments** → Último deployment
3. **View Function Logs**
4. Busca errores o confirmaciones de requests exitosos

---

## 🔒 6. Seguridad

### ✅ Checklist de seguridad:

- [ ] `.env.local` está en `.gitignore` (no se sube a Git)
- [ ] La API key NO está hardcodeada en el código
- [ ] Solo se usa `process.env.ANTHROPIC_API_KEY`
- [ ] Los errores no exponen información sensible

---

## 🚀 7. Para Producción (Vercel)

### ✅ Antes de desplegar:

- [ ] Código subido a Git (GitHub/GitLab)
- [ ] Repositorio conectado a Vercel
- [ ] Variable `ANTHROPIC_API_KEY` agregada en Vercel
- [ ] Build exitoso (`npm run build` funciona localmente)
- [ ] Prueba el endpoint en producción después del deploy

---

## 📝 8. Estructura del Request

### ✅ El frontend debe enviar:

```json
{
  "studentName": "Juan Pérez",
  "incidencias": [
    {
      "tipo": "ausencia",
      "descripcion": "No asistió a clase",
      "fecha": "2024-12-02",
      "profesor": "Prof. García"
    }
  ]
}
```

### ✅ El backend devuelve:

```json
{
  "report": "**Resumen General**: ...",
  "timestamp": "2024-12-15T10:30:00.000Z"
}
```

---

## 🎯 Resumen Rápido

**Para que el backend funcione, necesitas:**

1. ✅ API Key de Anthropic configurada (`.env.local` y Vercel)
2. ✅ Servidor corriendo (`npm run dev`)
3. ✅ Créditos en Anthropic
4. ✅ El endpoint `/api/generate-report` accesible

**Si algo falla:**
- Revisa los logs (consola local o Vercel)
- Verifica la API key en Anthropic Console
- Prueba el endpoint directamente con curl

---

**¿Todo listo?** Prueba generar un reporte en la página del Director. Si funciona, ¡el backend está configurado correctamente! 🎉

