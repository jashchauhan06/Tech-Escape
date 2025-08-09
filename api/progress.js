import { createClient } from '@supabase/supabase-js'

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  return await new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')) } catch { resolve({}) }
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Supabase not configured' })
  }
  const supabase = createClient(supabaseUrl, supabaseKey)

  const body = await parseBody(req)
  const teamId = body.teamId
  const teamname = String(body.teamname || '').trim()
  const deltaMs = Number(body.deltaMs) || 0
  const completedCount = Math.max(0, Number(body.completedCount) || 0)
  const finished = Boolean(body.finished)

  if (!teamId || !teamname) {
    return res.status(400).json({ success: false, error: 'Missing teamId or teamname' })
  }

  try {
    // Ensure a row exists
    const now = new Date().toISOString()
    const { data: existing } = await supabase
      .from('team_progress')
      .select('team_id, total_time_ms, completed_count, started_at')
      .eq('team_id', teamId)
      .maybeSingle()

    const payload = {
      team_id: teamId,
      teamname,
      total_time_ms: Math.max(0, (existing?.total_time_ms || 0) + (deltaMs > 0 ? deltaMs : 0)),
      completed_count: Math.max(existing?.completed_count || 0, completedCount),
      updated_at: now,
    }
    if (!existing?.started_at) payload.started_at = now
    if (finished) payload.finished_at = now

    const { data, error } = await supabase
      .from('team_progress')
      .upsert(payload, { onConflict: 'team_id' })
      .select('*')
      .single()
    if (error) throw error

    return res.status(200).json({ success: true, progress: data })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
}


