import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema, signUpSchema } from '../../../lib/validations/auth'
import { useAuth } from '../../../lib/supabase/auth'
import { Button } from '../../common/Button'
import { Input } from '../../common/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../common/Card'
import toast from 'react-hot-toast'

interface SignUpFormProps {
  onToggleForm: () => void
}

export function SignUpForm({ onToggleForm }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpSchema) => {
    try {
      setIsLoading(true)
      await signUp(data.email, data.password)
      setIsEmailSent(true)
      toast.success('Please check your email to confirm your account')
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error(error instanceof Error ? error.message : 'Error signing up')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent you a confirmation email. Please check your inbox and click the confirmation link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onToggleForm}
            >
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Enter your email and password to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isLoading}
          />
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isLoading}
          />
          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onToggleForm}
              disabled={isLoading}
            >
              Already have an account? Sign In
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 