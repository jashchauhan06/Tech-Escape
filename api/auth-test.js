import { createClient } from '@supabase/supabase-js'

// This endpoint tries a real Supabase Auth sign-in using TEST_EMAIL/TEST_PASSWORD
// from environment variables to generate an auth.signin event in Supabase Logs.
export default async function handler(req, res) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  const testEmail = process.env.TEST_EMAIL
  const testPassword = process.env.TEST_PASSWORD

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      error: 'Missing Supabase environment variables',
    })
  }
  if (!testEmail || !testPassword) {
    return res.status(400).json({
      success: false,
      error: 'Set TEST_EMAIL and TEST_PASSWORD in Vercel env to run auth test',
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })
    if (error) {
      return res.status(401).json({ success: false, error: error.message })
    }
    return res.status(200).json({ success: true, user: data.user })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
}


