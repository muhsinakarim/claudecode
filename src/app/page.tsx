'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Camera, Users, TrendingUp, DollarSign, CheckCircle } from 'lucide-react'
import AlamyLogo from '../components/AlamyLogo'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border-tertiary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <AlamyLogo width={40} height={40} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Alamy Contributors
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ 
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Earn Money from Your{' '}
              <span style={{ color: 'var(--surface-brand)' }}>Photography</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-tertiary)' }}>
              Join thousands of photographers earning up to 50% commission by selling their images on Alamy
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--surface-brand)' }}>$2.3M+</div>
              <div style={{ color: 'var(--text-tertiary)' }}>Paid to contributors monthly</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--surface-brand)' }}>250K+</div>
              <div style={{ color: 'var(--text-tertiary)' }}>Active contributors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--surface-brand)' }}>50%</div>
              <div style={{ color: 'var(--text-tertiary)' }}>Commission rate</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--surface-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Choose Your Path
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-tertiary)' }}>
              Get started based on your current status with Alamy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* New to Alamy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="rounded-2xl p-8 border-2 transition-all duration-300 hover:border-brand"
              style={{ 
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-tertiary)',
                borderRadius: 'var(--radius-8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--surface-brand)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-tertiary)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 255, 123, 0.1)' }}>
                  <Users className="h-8 w-8" style={{ color: 'var(--surface-brand)' }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  New to Alamy
                </h3>
                <p style={{ color: 'var(--text-tertiary)' }}>
                  Don&apos;t have an Alamy account yet? Start here to create your account and become a contributor.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Create your Alamy account</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Set up contributor profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Take quality assessment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Start uploading & earning</span>
                </div>
              </div>

              <Link
                href="/register"
                className="block w-full text-center py-4 px-6 rounded-lg font-semibold transition-all duration-200"
                style={{
                  backgroundColor: 'var(--surface-brand)',
                  color: '#000000',
                  borderRadius: 'var(--radius-4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Get Started - It&apos;s Free
              </Link>
            </motion.div>

            {/* Existing Alamy User */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="rounded-2xl p-8 border-2 transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-tertiary)',
                borderRadius: 'var(--radius-8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--surface-brand)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-tertiary)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 255, 123, 0.1)' }}>
                  <Camera className="h-8 w-8" style={{ color: 'var(--surface-brand)' }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Existing Alamy User
                </h3>
                <p style={{ color: 'var(--text-tertiary)' }}>
                  Already have an Alamy account? Perfect! Complete your contributor setup to start selling.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Complete contributor profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Take quality assessment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Upload your first images</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Start earning immediately</span>
                </div>
              </div>

              <Link
                href="/contributor-setup"
                className="block w-full text-center py-4 px-6 rounded-lg font-semibold transition-all duration-200 border-2"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--surface-brand)',
                  borderColor: 'var(--surface-brand)',
                  borderRadius: 'var(--radius-4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-brand)'
                  e.currentTarget.style.color = '#000000'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--surface-brand)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Complete Contributor Setup
              </Link>
            </motion.div>
          </div>

          {/* Already a Contributor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center mt-12"
          >
            <p className="mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Already a contributor?
            </p>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors"
              style={{
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <span>Sign in to your dashboard</span>
              <TrendingUp className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Why Choose Alamy?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center"
            >
              <DollarSign className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--surface-brand)' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                High Commission Rates
              </h3>
              <p style={{ color: 'var(--text-tertiary)' }}>
                Earn up to 50% commission on every sale, with 100% for students
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="text-center"
            >
              <Camera className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--surface-brand)' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Keep Your Rights
              </h3>
              <p style={{ color: 'var(--text-tertiary)' }}>
                Retain full copyright of your images and sell non-exclusively
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="text-center"
            >
              <TrendingUp className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--surface-brand)' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Global Reach
              </h3>
              <p style={{ color: 'var(--text-tertiary)' }}>
                Access millions of buyers worldwide through our established platform
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: 'var(--border-tertiary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p style={{ color: 'var(--text-tertiary)' }}>
            © 2024 Alamy Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
