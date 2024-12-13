import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../lib/supabase/auth'
import { supabase } from '../lib/supabaseClient'
import { generateRoadmap } from '../lib/services/gemini'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { BackButton } from '../components/common/BackButton'
import { Card } from '../components/common/Card'
import toast from 'react-hot-toast'

const createRoadmapSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced']),
  time_commitment_hours: z.number().min(1, 'Time commitment must be at least 1 hour'),
  learning_style: z.array(z.string()).min(1, 'Select at least one learning style')
})

type CreateRoadmapSchema = z.infer<typeof createRoadmapSchema>

const LEARNING_STYLES = ['books', 'articles', 'video', 'interactive']

export function CreateAIRoadmap() {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateRoadmapSchema>({
    resolver: zodResolver(createRoadmapSchema),
    defaultValues: {
      learning_style: []
    }
  })

  const toggleLearningStyle = (style: string) => {
    const newStyles = selectedStyles.includes(style)
      ? selectedStyles.filter(s => s !== style)
      : [...selectedStyles, style]
    
    setSelectedStyles(newStyles)
    setValue('learning_style', newStyles, { shouldValidate: true })
  }

  const onSubmit = async (data: CreateRoadmapSchema) => {
    if (!user) {
      toast.error('You must be logged in to create a roadmap')
      return
    }

    try {
      setIsCreating(true)

      // Check remaining AI roadmaps
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('ai_roadmaps_remaining')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      if (!profile || profile.ai_roadmaps_remaining <= 0) {
        throw new Error('No AI roadmaps remaining')
      }

      // Generate roadmap content
      const content = await generateRoadmap({
        title: data.title,
        skill_level: data.skill_level,
        time_commitment_hours: data.time_commitment_hours,
        learning_style: selectedStyles
      })

      // Save roadmap with content
      const { data: roadmap, error: roadmapError } = await supabase
        .from('roadmaps')
        .insert({
          user_id: user.id,
          title: data.title,
          type: 'ai',
          skill_level: data.skill_level,
          time_commitment_hours: data.time_commitment_hours,
          learning_style: selectedStyles,
          privacy: 'private',
          content: content // Save the entire content object
        })
        .select()
        .single()

      if (roadmapError) throw roadmapError

      // Update remaining roadmaps count
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ai_roadmaps_remaining: profile.ai_roadmaps_remaining - 1
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success('AI roadmap created successfully!')
      navigate(`/roadmap/${roadmap.id}`)
    } catch (error) {
      console.error('Error creating roadmap:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create roadmap')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create AI Roadmap - Probe</title>
        <meta name="description" content="Create an AI-generated learning roadmap" />
      </Helmet>

      <div className="container py-6 px-4 md:py-12 md:px-6">
        <BackButton />
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Create AI Roadmap</h1>

          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Title"
                placeholder="e.g., Learn Web Development"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
                disabled={isCreating}
              />

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Skill Level
                </label>
                <select
                  {...register('skill_level')}
                  className="brutal-input w-full"
                  disabled={isCreating}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {errors.skill_level && (
                  <p className="text-sm text-error mt-1">{errors.skill_level.message}</p>
                )}
              </div>

              <Input
                type="number"
                label="Time Commitment (hours/week)"
                placeholder="e.g., 10"
                {...register('time_commitment_hours', { valueAsNumber: true })}
                error={!!errors.time_commitment_hours}
                helperText={errors.time_commitment_hours?.message}
                disabled={isCreating}
              />

              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Learning Styles
                </label>
                <div className="flex flex-wrap gap-2">
                  {LEARNING_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleLearningStyle(style)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedStyles.includes(style)
                          ? 'bg-primary-orange text-white border-primary-orange'
                          : 'border-gray-300 hover:border-primary-orange'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                {errors.learning_style && (
                  <p className="text-sm text-error mt-1">{errors.learning_style.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isCreating || selectedStyles.length === 0}
              >
                {isCreating ? 'Creating Roadmap...' : 'Create Roadmap'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
} 