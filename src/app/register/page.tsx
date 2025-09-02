'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FormInput from '../../components/FormInput'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store user info for personalized dashboard (client-side only)
        if (typeof window !== 'undefined') {
          const userData = {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            joinDate: new Date().toISOString(),
            contributorStatus: 'new' as const
          }
          localStorage.setItem('user', JSON.stringify(userData))
        }
        
        // Registration complete, redirect to contributor setup
        router.push('/contributor-setup')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Create Alamy Account
            </h1>
            <p style={{ color: 'var(--text-tertiary)' }}>
              Start your journey with just email and password
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                validation={{
                  minLength: 2,
                  message: "First name must be at least 2 characters"
                }}
              />
              <FormInput
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                validation={{
                  minLength: 2,
                  message: "Last name must be at least 2 characters"
                }}
              />
            </div>

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              validation={{
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address"
              }}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              showPasswordToggle
              validation={{
                validator: (value) => {
                  const hasMinLength = value.length >= 8
                  const hasUppercase = /[A-Z]/.test(value)
                  const hasLowercase = /[a-z]/.test(value)
                  const hasNumber = /[0-9]/.test(value)
                  const hasSpecial = /[^A-Za-z0-9]/.test(value)
                  
                  const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length
                  
                  if (score < 3) {
                    return { valid: false, message: "Password is too weak" }
                  }
                  return { valid: true }
                }
              }}
            />

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              showPasswordToggle
              validation={{
                validator: (value) => {
                  if (value !== formData.password) {
                    return { valid: false, message: "Passwords do not match" }
                  }
                  return { valid: true, message: "Passwords match" }
                }
              }}
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--surface-brand)',
                color: '#000000',
                borderRadius: 'var(--radius-4)'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Alamy Account'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: 'var(--text-tertiary)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium" style={{ color: 'var(--text-brand)' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}