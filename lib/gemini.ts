// lib/gemini.ts
// Utilidad para llamar a la API de Gemini (Google AI)

// Llama al endpoint local Next.js API Route para evitar CORS y exponer la clave
export async function obtenerAnalisisGemini(prompt: string): Promise<string> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    throw new Error("Error al llamar a Gemini local API: " + res.status);
  }
  const data = await res.json();
  if (data?.result) return data.result;
  throw new Error("Error en respuesta de Gemini local API");
}
