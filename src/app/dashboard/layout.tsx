'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Upload, 
  Images, 
  DollarSign, 
  Settings, 
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import AlamyLogo from '../../components/AlamyLogo'

// Sidebar Toggle Component
const SidebarToggle = ({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 z-50 w-6 h-6 rounded-full border shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
      style={{
        left: isCollapsed ? '4rem' : '18rem', // 64px : 288px (moved right to sidebar edge)
        backgroundColor: 'var(--surface-primary)',
        borderColor: 'var(--border-secondary)',
        color: 'var(--text-primary)',
        transform: 'translateX(-50%)'
      }}
      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
    </button>
  )
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'Upload Images', href: '/dashboard/upload', icon: Upload },
  { name: 'My Images', href: '/dashboard/images', icon: Images },
  { name: 'Sales & Revenue', href: '/dashboard/sales', icon: DollarSign },
  { name: 'Account Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-primary)' }}>
      {/* Mobile sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed inset-0 z-50 lg:hidden"
      >
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-72 px-6 py-6" style={{ backgroundColor: 'var(--surface-secondary)', borderRight: '1px solid var(--border-tertiary)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlamyLogo width={32} height={32} />
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Alamy Image Manager</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" style={{ color: 'var(--icon-secondary)' }} />
            </button>
          </div>
          
          <nav className="mt-8">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-3 py-3'} rounded-lg font-medium transition-colors ${isActive ? 'sidebar-nav-active' : ''}`}
                      style={{
                        backgroundColor: isActive ? 'var(--surface-brand)' : 'transparent',
                        color: isActive ? '#000000' : 'var(--text-tertiary)',
                        borderRadius: 'var(--radius-4)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
                          e.currentTarget.style.color = 'var(--text-primary)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = 'var(--text-tertiary)'
                        }
                      }}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-3 rounded-lg font-medium w-full transition-colors"
              style={{ 
                color: 'var(--text-tertiary)', 
                borderRadius: 'var(--radius-4)' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-tertiary)'
              }}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Desktop sidebar */}
      <div 
        className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300"
        style={{ 
          width: isCollapsed ? '4rem' : '18rem' // 64px : 288px
        }}
      >
        <div className={`flex grow flex-col gap-y-5 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'px-2 py-6' : 'px-6 py-6'} relative`} style={{ backgroundColor: 'var(--surface-secondary)', borderRight: '1px solid var(--border-tertiary)' }}>
          {/* Header */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
              <AlamyLogo width={32} height={32} />
              {!isCollapsed && <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Alamy Image Manager</span>}
            </div>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-3 py-3'} rounded-lg font-medium transition-colors ${isActive ? 'sidebar-nav-active' : ''}`}
                      style={{
                        backgroundColor: isActive ? 'var(--surface-brand)' : 'transparent',
                        color: isActive ? '#000000' : 'var(--text-tertiary)',
                        borderRadius: 'var(--radius-4)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
                          e.currentTarget.style.color = 'var(--text-primary)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = 'var(--text-tertiary)'
                        }
                      }}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
            
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className={`flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-3 py-3'} rounded-lg font-medium w-full transition-colors`}
                style={{ 
                  color: 'var(--text-tertiary)', 
                  borderRadius: 'var(--radius-4)' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--text-tertiary)'
                }}
                title={isCollapsed ? 'Logout' : undefined}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Floating Sidebar Toggle - Desktop only */}
      {isDesktop && (
        <SidebarToggle isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      )}

      {/* Main content */}
      <div 
        className="transition-all duration-300"
        style={{ 
          paddingLeft: isDesktop 
            ? (isCollapsed ? '4rem' : '18rem') 
            : '0' // No padding on mobile
        }}
      >
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8" style={{ borderBottom: '1px solid var(--border-tertiary)', backgroundColor: 'var(--surface-primary)' }}>
          <button
            type="button"
            className="-m-2.5 p-2.5 lg:hidden"
            style={{ color: 'var(--icon-secondary)' }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Removed notification bell */}
          <div className="flex items-center">
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}