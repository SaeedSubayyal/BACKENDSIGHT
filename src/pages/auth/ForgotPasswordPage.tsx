import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft } from 'lucide-react'
import { apiClient } from '../../lib/api'
import { API_ENDPOINTS } from '../../config/api'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    try {
      await apiClient.post(API_ENDPOINTS.passwordReset, data)
      setIsSubmitted(true)
      toast.success('Password reset email sent!')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to send reset email'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-success-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Check your email</h2>
          <p className="mt-2 text-secondary-600">
            We've sent a password reset link to your email address.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-secondary-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn-outline"
          >
            Try again
          </button>
        </div>
        <Link
          to="/auth/login"
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary-900">Forgot password?</h2>
        <p className="mt-2 text-secondary-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              {...register('email')}
              type="email"
              className="input pl-10"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>

      <div className="text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}