import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from './lib/supabase/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Landing } from './pages/Landing'
import { About } from './pages/About'
import { Features } from './pages/Features'
import { Pricing } from './pages/Pricing'
import { Contact } from './pages/Contact'
import { Auth } from './pages/Auth'
import { ResetPassword } from './pages/ResetPassword'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { Dashboard } from './pages/Dashboard'
import { CreateAIRoadmap } from './pages/CreateAIRoadmap'
import { CreateCustomRoadmap } from './pages/CreateCustomRoadmap'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-primary-white font-space-grotesk">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create/ai-roadmap" element={<CreateAIRoadmap />} />
                    <Route path="/create/custom-roadmap" element={<CreateCustomRoadmap />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
              <Toaster 
                position="top-center"
                toastOptions={{
                  className: 'brutal-card',
                  duration: 3000,
                }}
              />
            </div>
          </Router>
          <Analytics />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
