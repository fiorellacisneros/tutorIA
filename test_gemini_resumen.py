import requests
import json

GEMINI_API_KEY = "AIzaSyBono5ts-phOD_qzTLxKUgcY_Hi8_h5OF8"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key={GEMINI_API_KEY}"

prompt = (
    "Eres un asistente escolar experto. Analiza el siguiente perfil de estudiante y genera un informe profesional, claro y detallado, "
    "que incluya: resumen, hallazgos, fortalezas, áreas de mejora y una recomendación personalizada. "
    "Usa formato HTML con títulos y listas.\n\n"
    "Nombre: Juan Pérez\n"
    "Grado: 3\n"
    "Sección: A\n"
    "Asistencias: 20\n"
    "Ausencias: 2\n"
    "Tardanzas: 1\n"
    "Total de incidencias: 1\n"
    "Última incidencia: Conducta el 2025-11-10"
)

body = {
    "contents": [
        {
            "parts": [
                {"text": prompt}
            ]
        }
    ]
}

try:
    res = requests.post(GEMINI_API_URL, headers={"Content-Type": "application/json"}, data=json.dumps(body))
    print(res.status_code)
    print(res.text)
except Exception as e:
    print("Error:", e)
