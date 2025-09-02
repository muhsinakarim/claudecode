'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  isLoggedIn: boolean
}

const Navigation = ({ isLoggedIn }: NavigationProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
    }
    router.push('/login')
  }

  const publicNavItems = [
    { label: 'Login', href: '/login', active: pathname === '/login' },
    { label: 'Register', href: '/register', active: pathname === '/register' }
  ]

  const dashboardNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊', active: pathname === '/dashboard' },
    { label: 'Profile Setup', href: '/contributor-setup', icon: '👤', active: pathname === '/contributor-setup' },
    { label: 'Quality Check', href: '/quality-check', icon: '✨', active: pathname === '/quality-check' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️', active: pathname === '/dashboard/settings' }
  ]

  if (!isClient) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ backgroundColor: 'var(--surface-secondary)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold" style={{ color: 'var(--text-brand)' }}>
            Alamy
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-sm"
      style={{ 
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        borderBottom: '1px solid var(--border-tertiary)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href={isLoggedIn ? '/dashboard' : '/'} className="text-2xl font-bold" style={{ color: 'var(--text-brand)' }}>
          Alamy
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          {!isLoggedIn ? (
            // Public navigation
            <>
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    item.active 
                      ? 'text-black font-medium' 
                      : 'hover:bg-white/10'
                  }`}
                  style={{
                    backgroundColor: item.active ? 'var(--surface-brand)' : 'transparent',
                    color: item.active ? '#000000' : 'var(--text-primary)'
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </>
          ) : (
            // Dashboard navigation
            <>
              <div className="hidden md:flex items-center space-x-4">
                {dashboardNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      item.active 
                        ? 'text-black font-medium' 
                        : 'hover:bg-white/10'
                    }`}
                    style={{
                      backgroundColor: item.active ? 'var(--surface-brand)' : 'transparent',
                      color: item.active ? '#000000' : 'var(--text-primary)'
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="hidden md:block text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Welcome, {user.name || 'Contributor'}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border transition-colors hover:bg-red-600 hover:border-red-600"
                  style={{
                    borderColor: 'var(--border-tertiary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button className="p-2 rounded-lg" style={{ color: 'var(--text-primary)' }}>
                  ☰
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation