import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Support both public and non-public naming conventions
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      error: 'Missing environment variables',
      message: 'Supabase URL or Key not configured',
      details: {
        NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ),
        SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
        SUPABASE_ANON_KEY: Boolean(process.env.SUPABASE_ANON_KEY),
      },
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


