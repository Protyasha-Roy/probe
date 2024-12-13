import { useEffect, useState } from 'react'
import { AuthContext, AuthUser, getUserProfile, signInWithEmail, signUpWithEmail, resetPasswordForEmail, signOutUser } from './auth'
import { supabase } from '../supabaseClient'
import toast from 'react-hot-toast'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user && mounted) {
          try {
            const profile = await getUserProfile(session.user.id)
            setUser({ ...session.user, ...profile })
          } catch (error) {
            console.error('Error fetching user profile:', error)
            setUser(session.user)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (session?.user) {
        try {
          const profile = await getUserProfile(session.user.id)
          setUser({ ...session.user, ...profile })
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setUser(session.user)
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const { session, user: authUser } = await signInWithEmail(email, password)
      
      if (!authUser) {
        throw new Error('No user data received')
      }

      try {
        const profile = await getUserProfile(authUser.id)
        setUser({ ...authUser, ...profile })
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setUser(authUser)
      }

      toast.success('Successfully signed in!')
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error(error instanceof Error ? error.message : 'Error signing in')
      throw error
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const { user: authUser } = await signUpWithEmail(email, password)
      if (authUser) {
        setUser(authUser)
        toast.success('Successfully signed up! Please check your email for verification.')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error(error instanceof Error ? error.message : 'Error signing up')
      throw error
    }
  }

  async function signOut() {
    try {
      await signOutUser()
      setUser(null)
      toast.success('Successfully signed out!')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error(error instanceof Error ? error.message : 'Error signing out')
      throw error
    }
  }

  async function resetPassword(email: string) {
    try {
      await resetPasswordForEmail(email)
      toast.success('Password reset instructions sent to your email!')
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error(error instanceof Error ? error.message : 'Error resetting password')
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
} 