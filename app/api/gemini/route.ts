// Simple proxy API route for Gemini requests (Next.js Edge API Route)
// Place this file in /app/api/gemini/route.ts

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const GEMINI_API_KEY = "AIzaSyBono5ts-phOD_qzTLxKUgcY_Hi8_h5OF8";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;


  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let errorText = await res.text();
        console.error('Gemini API error:', res.status, errorText);
        return new Response(JSON.stringify({ error: true, status: res.status, message: errorText }), { status: 500 });
      }
      const data = await res.json();
      return new Response(JSON.stringify({ result: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar el análisis.", raw: data }), { status: 200 });

    } catch (e) {
      console.error('Error in Gemini proxy route:', e);
      return new Response(JSON.stringify({ error: true, message: e.message }), { status: 500 });

    }
  }





