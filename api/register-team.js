import { createClient } from '@supabase/supabase-js'

// Helper to parse JSON body for Vercel Node functions
async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  return await new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        resolve({})
      }
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      error: 'Missing Supabase configuration',
    })
  }

  const body = await parseBody(req)
  const { teamName, teamLeader, password } = body || {}

  if (!teamName || !teamLeader || !password) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Check duplicate team name
    const { data: existing } = await supabase
      .from('teams')
      .select('id')
      .eq('teamname', teamName)
      .maybeSingle()

    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: 'Team name already exists' })
    }

    const insertPayload = {
      teamname: teamName,
      leader: teamLeader,
      password,
    }

    const { data, error } = await supabase
      .from('teams')
      .insert([insertPayload])
      .select('*')
      .single()

    if (error) throw error

    return res.status(200).json({ success: true, team: data })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
}


