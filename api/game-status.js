import { createClient } from '@supabase/supabase-js'

const DEFAULT_DURATION_MS = 15 * 60 * 1000

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
      .select('id, started, start_time, duration_ms, paused')
      .eq('id', 1)
      .maybeSingle()

    if (!data || !data.started || !data.start_time) {
      return res
        .status(200)
        .json({ started: false, paused: false, remainingMs: null, startedAt: null })
    }

    const startedAtIso = new Date(data.start_time).toISOString()
    const durationMs = data.duration_ms ?? DEFAULT_DURATION_MS
    let remainingMs
    if (data.paused) {
      remainingMs = durationMs
    } else {
      const elapsed = Date.now() - new Date(data.start_time).getTime()
      remainingMs = Math.max(0, durationMs - elapsed)
    }

    return res
      .status(200)
      .json({ started: true, paused: !!data.paused, remainingMs, startedAt: startedAtIso })
  }

  if (req.method === 'POST') {
    const adminKey = req.headers['x-admin-key'] || req.headers['X-Admin-Key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const body = await parseBody(req)
    const action = body.action || 'start'

    if (action === 'start') {
      const durationMs =
        (Number(body.durationMinutes) || 15) * 60 * 1000
      const { data, error } = await supabase
        .from('game_state')
        .upsert(
          {
            id: 1,
            started: true,
            start_time: new Date().toISOString(),
            duration_ms: durationMs,
            paused: false,
          },
          { onConflict: 'id' }
        )
        .select('*')
        .single()
      if (error) return res.status(500).json({ success: false, error: error.message })
      return res.status(200).json({ success: true, state: data })
    }

    if (action === 'pause') {
      // Freeze remaining time by collapsing duration_ms to remaining and resetting start_time
      const { data: row } = await supabase
        .from('game_state')
        .select('start_time, duration_ms')
        .eq('id', 1)
        .maybeSingle()
      if (!row || !row.start_time) return res.status(400).json({ success: false, error: 'Game not started' })
      const elapsed = Date.now() - new Date(row.start_time).getTime()
      const remaining = Math.max(0, (row.duration_ms ?? DEFAULT_DURATION_MS) - elapsed)
      const { data, error } = await supabase
        .from('game_state')
        .upsert(
          { id: 1, paused: true, start_time: new Date().toISOString(), duration_ms: remaining },
          { onConflict: 'id' }
        )
        .select('*')
        .single()
      if (error) return res.status(500).json({ success: false, error: error.message })
      return res.status(200).json({ success: true, state: data })
    }

    if (action === 'resume') {
      const { data, error } = await supabase
        .from('game_state')
        .upsert(
          { id: 1, paused: false, start_time: new Date().toISOString() },
          { onConflict: 'id' }
        )
        .select('*')
        .single()
      if (error) return res.status(500).json({ success: false, error: error.message })
      return res.status(200).json({ success: true, state: data })
    }

    if (action === 'extend') {
      const delta = Number(body.minutes) || 0
      const deltaMs = Math.round(delta * 60 * 1000)
      const { data: row } = await supabase
        .from('game_state')
        .select('duration_ms')
        .eq('id', 1)
        .maybeSingle()
      const newDuration = (row?.duration_ms ?? DEFAULT_DURATION_MS) + deltaMs
      const { data, error } = await supabase
        .from('game_state')
        .upsert({ id: 1, duration_ms: newDuration }, { onConflict: 'id' })
        .select('*')
        .single()
      if (error) return res.status(500).json({ success: false, error: error.message })
      return res.status(200).json({ success: true, state: data })
    }

    if (action === 'stop' || action === 'reset') {
      const { data, error } = await supabase
        .from('game_state')
        .upsert(
          { id: 1, started: false, paused: false, start_time: null, duration_ms: DEFAULT_DURATION_MS },
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


