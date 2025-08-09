import { createClient } from '@supabase/supabase-js'

// GET → { success: boolean, count?: number }
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
    // Count teams without returning rows
    const { count, error } = await supabase
      .from('teams')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return res.status(200).json({ success: true, count: count || 0 })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
}


