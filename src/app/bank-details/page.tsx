'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Lock, CheckCircle } from 'lucide-react'

export default function BankDetailsPage() {
  const [formData, setFormData] = useState({
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    bankName: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to save bank details:', error)
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

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-secondary)' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(0, 255, 123, 0.2)' }}
            >
              <CheckCircle className="h-10 w-10" style={{ color: 'var(--surface-brand)' }} />
            </motion.div>
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Bank Details Saved Securely!
            </h1>
            <p className="mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Your payment information has been encrypted and stored safely. 
              You&apos;re now ready to start earning from your photography!
            </p>
            <div className="text-sm" style={{ color: 'var(--text-moderate)' }}>
              Redirecting to dashboard...
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Secure Payment Setup
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-tertiary)' }}>
            Add your bank details to receive payments for your photo sales
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl shadow-xl p-8"
          style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-secondary)' }}
        >
          {/* Security Assurance */}
          <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: 'rgba(0, 255, 123, 0.1)', border: '1px solid rgba(0, 255, 123, 0.3)' }}>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6" style={{ color: 'var(--surface-brand)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Bank-Grade Security</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" style={{ color: 'var(--surface-brand)' }} />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" style={{ color: 'var(--surface-brand)' }} />
                <span>PCI DSS compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" style={{ color: 'var(--surface-brand)' }} />
                <span>SOC 2 Type II certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" style={{ color: 'var(--surface-brand)' }} />
                <span>Zero data logging</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accountHolderName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Account Holder Name
              </label>
              <input
                type="text"
                id="accountHolderName"
                name="accountHolderName"
                required
                value={formData.accountHolderName}
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
                placeholder="Enter full name as it appears on your account"
              />
            </div>

            <div>
              <label htmlFor="bankName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                required
                value={formData.bankName}
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
                placeholder="Enter your bank name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  required
                  value={formData.accountNumber}
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
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label htmlFor="routingNumber" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Routing Number
                </label>
                <input
                  type="text"
                  id="routingNumber"
                  name="routingNumber"
                  required
                  value={formData.routingNumber}
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
                  placeholder="Enter routing number"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--surface-brand)',
                color: '#000000',
                borderRadius: 'var(--radius-4)'
              }}
            >
              {loading ? 'Encrypting & Saving...' : 'Save Bank Details Securely'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-moderate)' }}>
              Your information is encrypted end-to-end and never stored in plain text. 
              We comply with all financial security regulations.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}