'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-tertiary)', 
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-4)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--border-brand)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 123, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-tertiary)'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-tertiary)', 
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-4)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--border-brand)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 123, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-tertiary)'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-tertiary)', 
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-4)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--border-brand)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 123, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-tertiary)'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Confirm your password"
              />
            </div>

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