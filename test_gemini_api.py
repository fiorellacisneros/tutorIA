import requests
import json

GEMINI_API_KEY = "AIzaSyBono5ts-phOD_qzTLxKUgcY_Hi8_h5OF8"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key={GEMINI_API_KEY}"

body = {
    "contents": [
        {
            "parts": [
                {"text": "¿Cuál es la capital de Francia?"}
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
