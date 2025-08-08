// Simple test script for Supabase API
const testAPI = async () => {
  try {
    console.log('Testing Supabase API...')
    
    const response = await fetch('http://localhost:3000/api/test-supabase')
    const data = await response.json()
    
    console.log('✅ API Response:', data)
    
    if (data.success) {
      console.log('🎉 Supabase connection successful!')
    } else {
      console.log('❌ Supabase connection failed:', data.error)
    }
  } catch (error) {
    console.log('❌ Error testing API:', error.message)
  }
}

// Run the test
testAPI()
