import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../lib/supabaseClient'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/common/Card'
import toast from 'react-hot-toast'

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Check if we have a valid session for password reset
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Invalid or expired password reset link')
        navigate('/auth')
      }
    }
    checkSession()
  }, [navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordSchema) => {
    if (isLoading) return

    try {
      console.log('Starting password reset...');
      setIsLoading(true)

      let updateResponse;
      try {
        console.log('Calling updateUser...');
        updateResponse = await supabase.auth.updateUser({
          password: data.password,
        }).catch(e => {
          console.log('Error in updateUser:', e);
          throw e;
        });
        console.log('Raw updateUser response:', updateResponse);
      } catch (updateError) {
        console.log('Caught error during updateUser:', updateError);
        throw updateError;
      }

      const { data: updateData, error } = updateResponse;

      // Add debugging logs
      console.log('Update response:', { updateData, error });

      if (error) {
        throw error;
      }

      // Check if the update was successful
      if (updateData.user) {
        toast.success('Password updated successfully');
        
        // Add a small delay before signing out to ensure toast is shown
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sign out and navigate
        await supabase.auth.signOut();
        navigate('/auth');
      } else {
        throw new Error('Password update failed');
      }

    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error instanceof Error ? error.message : 'Error resetting password');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
            />
            <Input
              label="Confirm New Password"
              type="password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={isLoading}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 