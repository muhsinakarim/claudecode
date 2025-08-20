'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AlamyLogo from '../../components/AlamyLogo'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        if (data.user.qualityCheckPassed === null) {
          router.push('/quality-check')
        } else if (data.user.qualityCheckPassed === false) {
          router.push('/quality-check-failed')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-secondary)' }}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <AlamyLogo width={40} height={40} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-tertiary)' }}>
              Sign in to your Alamy account
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border px-4 py-3 rounded-lg mb-6" 
              style={{ 
                backgroundColor: 'rgba(255, 80, 23, 0.1)', 
                borderColor: 'var(--color-red-500)',
                color: 'var(--color-red-500)'
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              style={{ 
                backgroundColor: 'var(--surface-brand)', 
                color: '#000000',
                borderRadius: 'var(--radius-4)'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: 'var(--text-tertiary)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium" style={{ color: 'var(--text-brand)' }}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}