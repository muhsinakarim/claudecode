'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react'

interface FormInputProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  validation?: {
    pattern?: RegExp
    minLength?: number
    message?: string
    validator?: (value: string) => { valid: boolean; message?: string }
  }
  showPasswordToggle?: boolean
}

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  validation,
  showPasswordToggle = false
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [validationMessage, setValidationMessage] = useState('')

  const validateField = (fieldValue: string) => {
    if (!validation || !fieldValue) {
      setIsValid(null)
      setValidationMessage('')
      return
    }

    let valid = true
    let message = ''

    // Custom validator
    if (validation.validator) {
      const result = validation.validator(fieldValue)
      valid = result.valid
      message = result.message || ''
    }
    // Pattern validation
    else if (validation.pattern) {
      valid = validation.pattern.test(fieldValue)
      message = validation.message || 'Invalid format'
    }
    // Min length validation
    else if (validation.minLength) {
      valid = fieldValue.length >= validation.minLength
      message = validation.message || `Minimum ${validation.minLength} characters required`
    }

    setIsValid(valid)
    setValidationMessage(valid ? '' : message)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e)
    if (isTouched) {
      validateField(e.target.value)
    }
  }

  const handleBlur = () => {
    setIsTouched(true)
    validateField(value)
  }

  const inputType = showPasswordToggle && showPassword ? 'text' : type

  const getInputStyles = () => {
    let borderColor = 'var(--border-tertiary)'
    let boxShadow = 'none'

    if (isTouched && isValid !== null) {
      if (isValid) {
        borderColor = 'var(--color-green-500)'
        boxShadow = '0 0 0 3px rgba(0, 255, 123, 0.1)'
      } else {
        borderColor = 'var(--color-red-500)'
        boxShadow = '0 0 0 3px rgba(255, 80, 23, 0.1)'
      }
    }

    return {
      backgroundColor: 'var(--surface-primary)',
      borderColor,
      color: 'var(--text-primary)',
      borderRadius: 'var(--radius-4)',
      boxShadow
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {label} {required && <span style={{ color: 'var(--color-red-500)' }}>*</span>}
      </label>
      
      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          required={required}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all duration-200"
          style={getInputStyles()}
          placeholder={placeholder}
        />
        
        {/* Password toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
        
        {/* Validation icon */}
        {isTouched && isValid !== null && !showPasswordToggle && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isValid ? (
              <Check className="h-5 w-5" style={{ color: 'var(--color-green-500)' }} />
            ) : (
              <X className="h-5 w-5" style={{ color: 'var(--color-red-500)' }} />
            )}
          </div>
        )}
      </div>
      
      {/* Validation message */}
      <AnimatePresence>
        {isTouched && validationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-sm"
            style={{ color: isValid ? 'var(--color-green-500)' : 'var(--color-red-500)' }}
          >
            <AlertCircle className="h-4 w-4" />
            <span>{validationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Password strength indicator */}
      {type === 'password' && value && isTouched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Password strength:
          </div>
          <PasswordStrengthIndicator password={value} />
        </motion.div>
      )}
    </div>
  )
}

// Password strength component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = (pass: string) => {
    let score = 0
    const checks = [
      { test: pass.length >= 8, label: 'At least 8 characters' },
      { test: /[A-Z]/.test(pass), label: 'Uppercase letter' },
      { test: /[a-z]/.test(pass), label: 'Lowercase letter' },
      { test: /[0-9]/.test(pass), label: 'Number' },
      { test: /[^A-Za-z0-9]/.test(pass), label: 'Special character' }
    ]
    
    checks.forEach(check => {
      if (check.test) score++
    })
    
    return { score, checks, total: checks.length }
  }

  const { score, checks } = getStrength(password)
  const percentage = (score / checks.length) * 100
  
  const getStrengthColor = () => {
    if (percentage < 40) return 'var(--color-red-500)'
    if (percentage < 70) return 'var(--color-yellow-500)'
    return 'var(--color-green-500)'
  }

  const getStrengthText = () => {
    if (percentage < 40) return 'Weak'
    if (percentage < 70) return 'Medium'
    return 'Strong'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: 'var(--text-tertiary)' }}>{getStrengthText()}</span>
        <span style={{ color: 'var(--text-tertiary)' }}>{score}/{checks.length}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: 'var(--surface-tertiary)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full transition-colors duration-300"
          style={{ backgroundColor: getStrengthColor() }}
        />
      </div>
      
      <div className="space-y-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            {check.test ? (
              <Check className="h-3 w-3" style={{ color: 'var(--color-green-500)' }} />
            ) : (
              <X className="h-3 w-3" style={{ color: 'var(--color-red-400)' }} />
            )}
            <span style={{ color: check.test ? 'var(--color-green-500)' : 'var(--text-tertiary)' }}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormInput