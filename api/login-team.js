import { createClient } from '@supabase/supabase-js'

// POST { teamName, password }
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
    return res.status(500).json({ success: false, error: 'Supabase not configured' })
  }

  const body = await new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body)
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

  const { teamName, password } = body || {}
  if (!teamName || !password) {
    return res.status(400).json({ success: false, error: 'Missing credentials' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('teamname', teamName)
      .eq('password', password)
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(401).json({ success: false, error: 'Invalid credentials' })
    return res.status(200).json({ success: true, team: data })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
}


