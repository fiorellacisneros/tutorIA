# 🔧 Guía del Backend - TutorIA

Esta guía explica todo lo que necesitas saber sobre el backend de TutorIA para que funcione correctamente.

## 📍 Ubicación del Backend

El backend está en: `/app/api/generate-report/route.ts`

Es una **API Route de Next.js 14** que se ejecuta en el servidor.

## 🎯 ¿Qué hace el Backend?

El backend recibe las incidencias de un estudiante y genera un reporte inteligente usando la API de Claude (Anthropic).

### Flujo Completo:

```
Frontend (Director Page) 
  → POST /api/generate-report 
    → Valida datos
    → Construye prompt para Claude
    → Llama a Claude API
    → Procesa respuesta
    → Devuelve reporte al frontend
```

## 📥 Entrada (Request)

### Endpoint
```
POST /api/generate-report
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)
```json
{
  "studentName": "Juan Pérez",
  "incidencias": [
    {
      "tipo": "ausencia",
      "descripcion": "No asistió a clase",
      "fecha": "2024-12-02",
      "profesor": "Prof. García"
    },
    {
      "tipo": "positivo",
      "descripcion": "Ayudó a compañero",
      "fecha": "2024-12-05",
      "profesor": "Prof. López"
    }
  ]
}
```

### Validaciones que hace el Backend:

1. ✅ Verifica que `incidencias` exista y tenga al menos 1 elemento
2. ✅ Verifica que `studentName` no esté vacío
3. ✅ Verifica que `ANTHROPIC_API_KEY` esté configurada

Si alguna validación falla, devuelve error 400 o 500.

## 📤 Salida (Response)

### Éxito (200)
```json
{
  "report": "**Resumen General**: Juan Pérez muestra un patrón...",
  "timestamp": "2024-12-15T10:30:00.000Z"
}
```

### Errores Posibles

#### 400 - Bad Request
```json
{
  "error": "No hay incidencias para analizar"
}
```
o
```json
{
  "error": "Nombre del estudiante es requerido"
}
```

#### 500 - Server Error
```json
{
  "error": "Configuración de API no disponible"
}
```
(No hay API key configurada)

```json
{
  "error": "Error al generar el reporte con IA"
}
```
(Error al llamar a Claude API)

## 🔑 Configuración Requerida

### Variable de Entorno

**Nombre**: `ANTHROPIC_API_KEY`

**Valor**: Tu API key de Anthropic (empieza con `sk-ant-`)

**Dónde configurarla:**

1. **Localmente**: Archivo `.env.local` en la raíz del proyecto
   ```bash
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

2. **En Vercel**: 
   - Settings → Environment Variables
   - Agrega `ANTHROPIC_API_KEY` con tu key

### ⚠️ IMPORTANTE

- La API key **NUNCA** debe estar en el código
- Siempre usa variables de entorno
- El archivo `.env.local` está en `.gitignore` (no se sube a Git)

## 🤖 Integración con Claude API

### Modelo Usado
```javascript
model: 'claude-3-sonnet-20240229'
```

### Endpoint de Claude
```
https://api.anthropic.com/v1/messages
```

### Headers Requeridos
```javascript
{
  'Content-Type': 'application/json',
  'x-api-key': process.env.ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01'
}
```

### Body que envía a Claude
```json
{
  "model": "claude-3-sonnet-20240229",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Eres un asistente educativo especializado. Analiza..."
    }
  ]
}
```

### Respuesta de Claude
```json
{
  "content": [
    {
      "type": "text",
      "text": "**Resumen General**: ..."
    }
  ]
}
```

El backend extrae `content[0].text` y lo devuelve al frontend.

## 📝 Prompt que se Envía a Claude

El backend construye un prompt estructurado que incluye:

1. **Contexto**: "Eres un asistente educativo especializado"
2. **Datos del estudiante**: Nombre y todas sus incidencias formateadas
3. **Instrucciones**: Qué debe incluir el reporte:
   - Resumen General
   - Patrones Detectados
   - Alertas
   - Aspectos Positivos
   - Recomendaciones
4. **Formato**: Máximo 200 palabras, tono profesional pero empático

### Ejemplo de Prompt Generado:

```
Eres un asistente educativo especializado. Analiza los siguientes datos del estudiante Juan Pérez:

Incidencias registradas:
1. Tipo: ausencia, Fecha: 2024-12-02, Descripción: No asistió a clase, Profesor: Prof. García
2. Tipo: ausencia, Fecha: 2024-12-09, Descripción: Falta sin justificar, Profesor: Prof. García
3. Tipo: positivo, Fecha: 2024-12-05, Descripción: Ayudó a compañero en matemáticas, Profesor: Prof. López

Genera un reporte ejecutivo profesional (máximo 200 palabras) que incluya:

1. **Resumen General**: Visión general del desempeño del estudiante
2. **Patrones Detectados**: Identifica tendencias en fechas, tipos de incidencias
3. **Alertas**: Señala comportamientos que requieren atención
4. **Aspectos Positivos**: Resalta logros o mejoras
5. **Recomendaciones**: Acciones sugeridas para el director

Usa un tono profesional pero empático. Sé específico con fechas y datos.
```

## 🐛 Debugging y Logs

### Logs en Consola (Servidor)

El backend registra errores en la consola:

```javascript
console.error('ANTHROPIC_API_KEY no está configurada');
console.error('Error de Claude API:', response.status, errorText);
console.error('Error en generate-report:', error);
```

### Ver Logs en Vercel

1. Ve a tu proyecto en Vercel
2. **Deployments** → Selecciona un deployment
3. **View Function Logs**
4. Busca errores relacionados con la API

### Errores Comunes

#### 1. "Configuración de API no disponible"
**Causa**: `ANTHROPIC_API_KEY` no está configurada

**Solución**:
- Verifica que existe `.env.local` localmente
- Verifica que la variable está en Vercel (Settings → Environment Variables)
- Reinicia el servidor después de agregar la variable

#### 2. "Error al generar el reporte con IA"
**Causa**: 
- API key inválida
- Sin créditos en Anthropic
- Modelo incorrecto
- Error de red

**Solución**:
- Verifica la API key en [Anthropic Console](https://console.anthropic.com/)
- Verifica que tengas créditos disponibles
- Revisa los logs en Vercel para más detalles

#### 3. Error 401 (Unauthorized)
**Causa**: API key incorrecta o expirada

**Solución**: Genera una nueva API key en Anthropic Console

#### 4. Error 429 (Rate Limit)
**Causa**: Demasiadas solicitudes

**Solución**: Espera unos minutos o verifica tu plan de Anthropic

## 🔒 Seguridad

### ✅ Buenas Prácticas Implementadas

1. **API key en variables de entorno** (nunca en código)
2. **Validación de entrada** (previene datos malformados)
3. **Manejo de errores** (no expone información sensible)
4. **Logs controlados** (solo errores, no datos sensibles)

### ⚠️ Consideraciones

- El backend es **público** (cualquiera puede llamarlo)
- No hay autenticación (para hackathon está bien)
- Para producción, agrega:
  - Autenticación (JWT, sessions)
  - Rate limiting
  - Validación más estricta
  - Logging de seguridad

## 🚀 Optimizaciones Futuras

### Para Producción:

1. **Caching**: Cachear reportes generados (mismo estudiante, mismas incidencias)
2. **Rate Limiting**: Limitar requests por usuario/IP
3. **Queue System**: Para manejar múltiples requests simultáneos
4. **Error Retry**: Reintentar si Claude API falla temporalmente
5. **Monitoring**: Integrar con Sentry o similar para errores

## 📊 Límites y Costos

### Claude API

- **Modelo**: `claude-3-sonnet-20240229`
- **Max Tokens**: 1000 (configurado en el código)
- **Costo aproximado**: ~$0.003 por request (varía)
- **Rate Limits**: Dependen de tu plan en Anthropic

### Recomendaciones

- Para hackathons: Usa el plan gratuito de Anthropic
- Monitorea el uso en [Anthropic Console](https://console.anthropic.com/)
- Considera reducir `max_tokens` si necesitas ahorrar

## 🧪 Testing Local

### Probar el Backend Directamente

```bash
# Inicia el servidor
npm run dev

# En otra terminal, prueba con curl:
curl -X POST http://localhost:3000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Juan Pérez",
    "incidencias": [
      {
        "tipo": "ausencia",
        "descripcion": "No asistió a clase",
        "fecha": "2024-12-02",
        "profesor": "Prof. García"
      }
    ]
  }'
```

### Verificar que Funciona

1. Debe devolver status 200
2. Debe incluir `report` y `timestamp` en la respuesta
3. El `report` debe contener texto generado por IA

## 📚 Recursos

- [Next.js API Routes Docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Anthropic API Docs](https://docs.anthropic.com/claude/reference/messages-post)
- [Claude Models](https://docs.anthropic.com/claude/docs/models-overview)

---

**¿Preguntas?** Revisa el código en `/app/api/generate-report/route.ts` o los logs de Vercel.

