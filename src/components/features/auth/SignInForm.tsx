import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInSchema, signInSchema } from '../../../lib/validations/auth'
import { useAuth } from '../../../lib/supabase/auth'
import { Button } from '../../common/Button'
import { Input } from '../../common/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../common/Card'

interface SignInFormProps {
  onToggleForm: () => void
  onForgotPassword: () => void
}

export function SignInForm({ onToggleForm, onForgotPassword }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInSchema) => {
    try {
      setIsLoading(true)
      await signIn(data.email, data.password)
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to sign in to your account
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
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onForgotPassword}
              disabled={isLoading}
            >
              Forgot Password?
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onToggleForm}
              disabled={isLoading}
            >
              Don't have an account? Sign Up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 