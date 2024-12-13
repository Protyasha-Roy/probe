import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../../common/Button'
import { Input } from '../../common/Input'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../lib/supabase/auth'
import toast from 'react-hot-toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactSchema = z.infer<typeof contactSchema>

export function Contact() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: user ? {
      name: user.user_metadata?.full_name || '',
      email: user.email || '',
    } : undefined,
  })

  const onSubmit = async (data: ContactSchema) => {
    try {
      setIsLoading(true)

      // Prepare feedback data
      const feedbackData = {
        name: data.name,
        email: data.email,
        message: data.message,
        status: 'unread',
        ...(user?.id ? { user_id: user.id } : {}) // Only add user_id if user is authenticated
      }

      // Insert feedback message
      const { error } = await supabase
        .from('feedback_messages')
        .insert(feedbackData)

      if (error) {
        console.error('Insert error:', error)
        throw new Error('Failed to send message. Please try again.')
      }

      setIsSubmitted(true)
      toast.success('Message sent successfully!')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-primary-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="brutal-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p className="text-primary-black/70 mb-6">
                We've received your message and will get back to you soon.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 bg-primary-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get in <span className="text-primary-orange">Touch</span>
            </h2>
            <p className="text-lg text-primary-black/70 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="brutal-card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                />
                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-black mb-2">
                  Message
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className={`brutal-input w-full resize-none ${
                    errors.message ? 'border-error' : ''
                  }`}
                  disabled={isLoading}
                />
                {errors.message && (
                  <p className="text-sm text-error mt-1">{errors.message.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
} 