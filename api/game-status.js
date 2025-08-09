import { createClient } from '@supabase/supabase-js'

const DURATION_MS = 15 * 60 * 1000

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  return await new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'))
      } catch {
        resolve({})
      }
    })
  })
}

export default async function handler(req, res) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Supabase not configured' })
  }
  const supabase = createClient(supabaseUrl, supabaseKey)

  if (req.method === 'GET') {
    const { data } = await supabase
      .from('game_state')
      .select('id, started, start_time')
      .eq('id', 1)
      .maybeSingle()

    if (!data || !data.started || !data.start_time) {
      return res.status(200).json({ started: false, remainingMs: null, startedAt: null })
    }

    const startedAt = new Date(data.start_time).toISOString()
    const endMs = new Date(data.start_time).getTime() + DURATION_MS
    const remainingMs = Math.max(0, endMs - Date.now())

    return res.status(200).json({ started: true, remainingMs, startedAt })
  }

  if (req.method === 'POST') {
    const adminKey = req.headers['x-admin-key'] || req.headers['X-Admin-Key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const body = await parseBody(req)
    const action = body.action || 'start'

    if (action === 'start') {
      const { data, error } = await supabase
        .from('game_state')
        .upsert(
          { id: 1, started: true, start_time: new Date().toISOString() },
          { onConflict: 'id' }
        )
        .select('*')
        .single()
      if (error) return res.status(500).json({ success: false, error: error.message })
      return res.status(200).json({ success: true, state: data })
    }

    if (action === 'stop' || action === 'reset') {
      const { data, error } = await supabase
        .from('game_state')
        .upsert(
          { id: 1, started: false, start_time: null },
          { onConflict: 'id' }
        )
        .select('*')
        .single()
      if (error) return res.status(500).json({ success: false, error: error.message })
      return res.status(200).json({ success: true, state: data })
    }

    return res.status(400).json({ success: false, error: 'Unknown action' })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ success: false, error: 'Method Not Allowed' })
}


