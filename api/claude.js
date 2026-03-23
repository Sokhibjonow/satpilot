export const config = { runtime: 'edge' }

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
    const body = await req.json()
    const { messages, system } = body

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'No API key' }), { status: 500, headers: cors })
    }

    const payload = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: messages || [{ role: 'user', content: 'Hello' }],
    }
    if (system) payload.system = system

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    })

    const data = await resp.json()

    // Log error details in response for debugging
    if (!resp.ok) {
      console.error('Anthropic error:', JSON.stringify(data))
      return new Response(JSON.stringify({ 
        error: data.error?.message || 'Unknown error',
        type: data.error?.type,
        raw: data 
      }), { status: resp.status, headers: cors })
    }

    return new Response(JSON.stringify(data), { status: 200, headers: cors })

  } catch (err) {
    console.error('Handler error:', err.message)
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { status: 500, headers: cors })
  }
}
