import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/supabase/auth'
import { SignInForm } from '../components/features/auth/SignInForm'
import { SignUpForm } from '../components/features/auth/SignUpForm'
import { ForgotPasswordForm } from '../components/features/auth/ForgotPasswordForm'

type AuthView = 'sign-in' | 'sign-up' | 'forgot-password'

export function Auth() {
  const [view, setView] = useState<AuthView>('sign-in')
  const { user } = useAuth()

  // Redirect if user is already authenticated and email is confirmed
  if (user?.email_confirmed_at) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        {view === 'sign-in' && (
          <SignInForm
            onToggleForm={() => setView('sign-up')}
            onForgotPassword={() => setView('forgot-password')}
          />
        )}
        {view === 'sign-up' && (
          <SignUpForm onToggleForm={() => setView('sign-in')} />
        )}
        {view === 'forgot-password' && (
          <ForgotPasswordForm onBack={() => setView('sign-in')} />
        )}
      </div>
    </div>
  )
} 