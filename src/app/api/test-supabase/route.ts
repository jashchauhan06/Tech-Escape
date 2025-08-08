import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if Supabase environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        message: 'Supabase URL or Key not configured'
      }, { status: 500 })
    }

    // Try to import Supabase client
    let supabase
    try {
      const { createClient } = await import('@supabase/supabase-js')
      supabase = createClient(supabaseUrl, supabaseKey)
    } catch (importError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to import Supabase client',
        message: 'Supabase library not available'
      }, { status: 500 })
    }

    // Test basic connection
    const { data, error } = await supabase
      .from('teams')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        message: 'Supabase connection failed',
        details: {
          url: supabaseUrl ? 'Set' : 'Missing',
          key: supabaseKey ? 'Set' : 'Missing'
        }
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      data: data,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to connect to Supabase'
    }, { status: 500 })
  }
}
