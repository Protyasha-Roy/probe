import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import './App.css'

function App() {
  const [serverVersion, setServerVersion] = useState<string | null>(null)

  useEffect(() => {
    async function getSupabaseVersion() {
      const { data, error } = await supabase
        .from('_content_version')
        .select('version')
        .single()
      
      if (error) {
        console.error('Error fetching version:', error)
        return
      }
      
      setServerVersion(data?.version || 'Unknown')
    }

    getSupabaseVersion()
  }, [])

  return (
    <div className="App">
      <h1>Vite + React + Supabase</h1>
      <div className="card">
        <p>
          {serverVersion 
            ? `Connected to Supabase (Version: ${serverVersion})`
            : 'Connecting to Supabase...'}
        </p>
      </div>
    </div>
  )
}

export default App
