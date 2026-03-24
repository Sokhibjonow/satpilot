export const config = { runtime: 'edge' }

const SAT_SYSTEM = `You are SatPilot — a strict SAT exam preparation tutor built by Cubick.
RULES: Only discuss SAT topics (Math, Reading, Writing, Grammar, Vocabulary, test strategies).
If user writes anything unrelated to SAT — redirect them to SAT prep.
If user greets you — respond with a SAT tip or ask what topic they need.
Always respond in the same language as the user (English/Russian/Uzbek).
Always respond in valid JSON format as instructed.`

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

    const fullSystem = SAT_SYSTEM + '\n\n' + (system || '')

    // v1 API: inject system prompt as first user message
    const geminiMessages = [
      { role: 'user', parts: [{ text: fullSystem }] },
      { role: 'model', parts: [{ text: 'Understood. I am SatPilot, your SAT tutor. I will only discuss SAT topics and respond in JSON format.' }] },
      ...messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ]

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return new Response(JSON.stringify({
      content: [{ type: 'text', text }]
    }), { status: 200, headers: cors })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors })
  }
}
