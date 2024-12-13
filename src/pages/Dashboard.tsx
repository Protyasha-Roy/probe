import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../lib/supabase/auth'
import { supabase } from '../lib/supabaseClient'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import toast from 'react-hot-toast'

interface UserProfile {
  ai_roadmaps_remaining: number
  custom_roadmaps_remaining: number
  role: string
}

interface Roadmap {
  id: string
  title: string
  type: 'ai' | 'custom'
  skill_level: string
  created_at: string
}

export function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!user) return

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('ai_roadmaps_remaining, custom_roadmaps_remaining, role')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        // Fetch user's roadmaps
        const { data: roadmapsData, error: roadmapsError } = await supabase
          .from('roadmaps')
          .select('id, title, type, skill_level, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (roadmapsError) throw roadmapsError
        setRoadmaps(roadmapsData)

      } catch (error) {
        console.error('Error fetching user data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  if (loading) {
    return (
      <div className="container py-6 px-4 md:py-12 md:px-6">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Probe</title>
      </Helmet>

      <div className="container py-6 px-4 md:py-12 md:px-6">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
            <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link to="/create/ai-roadmap">
                <Button 
                  className="w-full text-xs sm:text-sm" 
                  disabled={profile.ai_roadmaps_remaining <= 0}
                >
                  AI Roadmap ({profile.ai_roadmaps_remaining})
                </Button>
              </Link>
              <Link to="/create/custom-roadmap">
                <Button 
                  variant="outline" 
                  className="w-full text-xs sm:text-sm"
                  disabled={profile.custom_roadmaps_remaining <= 0}
                >
                  Custom Roadmap ({profile.custom_roadmaps_remaining})
                </Button>
              </Link>
            </div>
          </div>

          {/* Subscription Status */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-3">Subscription Status</h2>
            <Card className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-semibold mb-2">
                    Current Plan: <span className="capitalize">{profile.role}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {profile.role === 'free' 
                      ? 'Upgrade to create more roadmaps and unlock premium features!'
                      : 'Thank you for being a premium member!'}
                  </p>
                </div>
                {profile.role === 'free' && (
                  <Link to="/pricing">
                    <Button className="w-full sm:w-auto">Upgrade Plan</Button>
                  </Link>
                )}
              </div>
            </Card>
          </section>

          {/* Roadmaps Section */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-3">Your Roadmaps</h2>
            {roadmaps.length === 0 ? (
              <Card className="p-4 md:p-6 text-center">
                <p className="text-gray-500 mb-3">You haven't created any roadmaps yet.</p>
                <p className="text-sm text-gray-400">
                  Create your first roadmap to start your learning journey!
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roadmaps.map((roadmap) => (
                  <Link key={roadmap.id} to={`/roadmap/${roadmap.id}`}>
                    <Card className="p-4 md:p-6 h-full hover:border-primary-orange transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold line-clamp-2 flex-1 mr-2">
                          {roadmap.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                          roadmap.type === 'ai' 
                            ? 'bg-primary-orange/10 text-primary-orange' 
                            : 'bg-gray-100'
                        }`}>
                          {roadmap.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span className="capitalize">{roadmap.skill_level}</span>
                        <span>•</span>
                        <span>{new Date(roadmap.created_at).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
} 