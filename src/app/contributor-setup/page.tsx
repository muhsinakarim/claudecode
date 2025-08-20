'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Lock } from 'lucide-react'
import AlamyLogo from '../../components/AlamyLogo'

export default function ContributorSetupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    phoneNumber: '',
    bio: '',
    experience: '',
    agreeToTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/contributor/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          country: formData.country,
          phoneNumber: formData.phoneNumber,
          bio: formData.bio,
          experience: formData.experience
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/quality-check')
      } else {
        setError(data.error || 'Setup failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-secondary)' }}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <AlamyLogo width={48} height={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Complete Your Contributor Profile
            </h1>
            <p style={{ color: 'var(--text-tertiary)' }}>
              Tell us about yourself to personalize your experience
            </p>
          </div>

          {/* Security Badge */}
          <div className="mb-6 p-4 rounded-lg flex items-center space-x-3" style={{ backgroundColor: 'rgba(0, 255, 123, 0.1)', border: '1px solid rgba(0, 255, 123, 0.3)' }}>
            <Shield className="h-6 w-6" style={{ color: 'var(--surface-brand)' }} />
            <div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Your Information is Safe With Us</h3>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Bank-level encryption • GDPR compliant • Never shared with third parties
              </p>
            </div>
            <Lock className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 rounded-lg border"
              style={{ 
                backgroundColor: 'rgba(255, 80, 23, 0.1)', 
                borderColor: 'var(--color-red-500)',
                color: 'var(--color-red-500)'
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  First Name <span style={{ color: 'var(--color-red-500)' }}>*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
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
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Last Name <span style={{ color: 'var(--color-red-500)' }}>*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
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
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Country <span style={{ color: 'var(--color-red-500)' }}>*</span>
              </label>
              <select
                id="country"
                name="country"
                required
                value={formData.country}
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
              >
                <option value="">Select your country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="IT">Italy</option>
                <option value="ES">Spain</option>
                <option value="NL">Netherlands</option>
                <option value="BE">Belgium</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Phone Number <span style={{ color: 'var(--color-red-500)' }}>*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
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
                placeholder="Enter your phone number with country code"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Photography Experience <span style={{ color: 'var(--color-red-500)' }}>*</span>
              </label>
              <select
                id="experience"
                name="experience"
                required
                value={formData.experience}
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
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="advanced">Advanced (5-10 years)</option>
                <option value="professional">Professional (10+ years)</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                About Your Photography (Optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio}
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
                placeholder="Tell us about your photography style, interests, and specialties..."
              />
            </div>

            {/* Terms and Conditions */}
            <div className="border-t pt-6" style={{ borderColor: 'var(--border-tertiary)' }}>
              <div className="mb-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 rounded transition-colors"
                    style={{
                      accentColor: 'var(--surface-brand)',
                      borderColor: 'var(--border-tertiary)'
                    }}
                  />
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    <span>I agree to Alamy's </span>
                    <a href="#" className="underline" style={{ color: 'var(--text-brand)' }}>
                      Terms and Conditions
                    </a>
                    <span>, </span>
                    <a href="#" className="underline" style={{ color: 'var(--text-brand)' }}>
                      Privacy Policy
                    </a>
                    <span>, and </span>
                    <a href="#" className="underline" style={{ color: 'var(--text-brand)' }}>
                      Contributor Agreement
                    </a>
                    <span style={{ color: 'var(--color-red-500)' }}> *</span>
                  </div>
                </label>
                
                {/* Show error message when terms not accepted */}
                {error === 'Please agree to the terms and conditions' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-2 p-3 rounded-lg border flex items-center space-x-2"
                    style={{ 
                      backgroundColor: 'rgba(255, 80, 23, 0.1)', 
                      borderColor: 'var(--color-red-500)',
                      color: 'var(--color-red-500)'
                    }}
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">You must agree to the terms and conditions to complete setup</span>
                  </motion.div>
                )}
              </div>

              {/* What's Next Section */}
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: 'rgba(0, 255, 123, 0.1)', borderLeft: '4px solid var(--surface-brand)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>What's Next?</h3>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-tertiary)' }}>
                  <li>• Complete your profile setup</li>
                  <li>• Upload test images for quality review</li>
                  <li>• Add bank details after approval</li>
                  <li>• Start earning from your photography!</li>
                </ul>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || !formData.agreeToTerms}
                whileHover={{ scale: loading || !formData.agreeToTerms ? 1 : 1.01 }}
                whileTap={{ scale: loading || !formData.agreeToTerms ? 1 : 0.99 }}
                className="w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: formData.agreeToTerms ? 'var(--surface-brand)' : 'var(--surface-tertiary)',
                  color: formData.agreeToTerms ? '#000000' : 'var(--text-moderate)',
                  borderRadius: 'var(--radius-4)'
                }}
              >
                {loading ? 'Setting Up Profile...' : 'Complete Setup & Continue'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}