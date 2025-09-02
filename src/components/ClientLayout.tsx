'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

interface ClientLayoutProps {
  children: React.ReactNode
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      const authToken = localStorage.getItem('authToken')
      setIsLoggedIn(!!(userData || authToken))
    }
  }, [pathname])

  // Don't render navigation on these pages
  const hideNavigation = ['/', '/login', '/register'].includes(pathname) || pathname.startsWith('/dashboard')

  if (!isClient) {
    return (
      <div className="min-h-screen">
        <main>
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {!hideNavigation && <Navigation isLoggedIn={isLoggedIn} />}
      <main className={!hideNavigation ? 'pt-20' : ''}>
        {children}
      </main>
    </div>
  )
}

export default ClientLayout