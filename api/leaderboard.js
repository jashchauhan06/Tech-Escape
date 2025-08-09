import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ success: false, error: 'Method Not Allowed' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Supabase not configured' })
  }
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Ensure table exists and query safe
    const { data, error } = await supabase
      .from('team_progress')
      .select('team_id, teamname, completed_count, total_time_ms, started_at, finished_at, updated_at')
      .order('completed_count', { ascending: false })
      .order('total_time_ms', { ascending: true })
      .order('updated_at', { ascending: true })
    if (error) throw error

    // Rank teams; ties resolved by time, then updated_at
    const ranked = (data || []).map((row, idx) => ({ rank: idx + 1, ...row }))
    return res.status(200).json({ success: true, leaderboard: ranked })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
}


