import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      error: 'Missing environment variables',
      message: 'Supabase URL or Key not configured',
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase.from('teams').select('count').limit(1)
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: 'Supabase connection failed',
      })
    }
    return res.status(200).json({
      success: true,
      message: 'Supabase connection successful!',
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: 'Failed to connect to Supabase',
    })
  }
}


