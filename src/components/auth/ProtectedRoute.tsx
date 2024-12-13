import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../lib/supabase/auth'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="brutal-card p-8">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (!user.email_confirmed_at) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="brutal-card p-8 max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Email Not Verified</h2>
          <p>Please check your email and click the confirmation link to access this page.</p>
        </div>
      </div>
    )
  }

  return <Outlet />
} 