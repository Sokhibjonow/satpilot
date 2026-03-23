export const config = { runtime: 'edge' }

const SAT_SYSTEM = `You are SatPilot — a strict SAT exam preparation tutor built by Cubick.

CRITICAL RULES:
- You ONLY discuss SAT-related topics: Math, Reading, Writing, Grammar, Vocabulary, test strategies, score improvement
- If user writes ANYTHING unrelated to SAT — redirect them back to SAT prep
- If user says "hello", "hi", "привет", "салам" or any greeting — respond with a short SAT tip or ask what SAT topic they need help with
- Never answer questions about other exams, life advice, coding, politics, weather, etc.
- Always respond in the same language the user writes in (English or Russian or Uzbek)
- Keep responses focused, educational, and SAT-specific
- You must ALWAYS respond in valid JSON format as instructed in the user message`

export default async function handler(req) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: cors })
  }

  try {
    const { messages, system } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not set' }), { status: 500, headers: cors })
    }

    // Build full system instruction
    const fullSystem = SAT_SYSTEM + '\n\n' + (system || '')

    // Convert messages to Gemini format
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: fullSystem }]
          },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      }
    )

    const data = await resp.json()

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Gemini error' }), { status: resp.status, headers: cors })
    }

    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Return in Anthropic format so frontend stays the same
    return new Response(JSON.stringify({
      content: [{ type: 'text', text }]
    }), { status: 200, headers: cors })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors })
  }
}
