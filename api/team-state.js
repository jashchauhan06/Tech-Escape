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
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Supabase not configured' })
  }
  const supabase = createClient(supabaseUrl, supabaseKey)

  if (req.method === 'GET') {
    try {
      const teamId = (req.query && (req.query.teamId || req.query.team_id)) ||
        (() => { try { return new URL(req.url, 'http://localhost').searchParams.get('teamId') } catch { return null } })()
      if (!teamId) return res.status(400).json({ success: false, error: 'Missing teamId' })

      const { data, error } = await supabase
        .from('teams')
        .select('id, teamname, progress')
        .eq('id', teamId)
        .maybeSingle()
      if (error) throw error

      const progress = data?.progress || {}
      const safe = {
        hintsUsed: Number(progress.hintsUsed || 0),
        currentRiddle: Number(progress.currentRiddle || 0),
        startTime: progress.startTime || null,
        completedRiddles: Array.isArray(progress.completedRiddles) ? progress.completedRiddles : []
      }
      return res.status(200).json({ success: true, state: safe })
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message })
    }
  }

  // POST
  try {
    const body = await parseBody(req)
    const teamId = body.teamId
    if (!teamId) return res.status(400).json({ success: false, error: 'Missing teamId' })

    // Read existing
    const { data: team, error: selErr } = await supabase
      .from('teams')
      .select('id, progress')
      .eq('id', teamId)
      .maybeSingle()
    if (selErr) throw selErr
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' })

    const prev = team.progress || {}
    const next = {
      ...prev,
      // Only update provided fields, keep others intact
      ...(typeof body.hintsUsed === 'number' ? { hintsUsed: Math.max(0, Math.floor(body.hintsUsed)) } : {}),
      ...(typeof body.currentRiddle === 'number' ? { currentRiddle: Math.max(0, Math.floor(body.currentRiddle)) } : {}),
      ...(body.startTime ? { startTime: String(body.startTime) } : {}),
      ...(Array.isArray(body.completedRiddles) ? { completedRiddles: body.completedRiddles } : {}),
    }

    const { data: updated, error: updErr } = await supabase
      .from('teams')
      .update({ progress: next })
      .eq('id', teamId)
      .select('id, progress')
      .single()
    if (updErr) throw updErr

    return res.status(200).json({ success: true, state: updated.progress })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
}


