'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Images, 
  DollarSign, 
  Eye,
  Download,
  Heart,
  Upload,
  CheckCircle,
  TrendingUp,
  Target,
  Clock,
  AlertCircle
} from 'lucide-react'
import { imageStore } from '../../lib/imageStore'
import { DashboardSkeleton } from '../../components/Skeleton'

interface User {
  name: string
  email: string
  joinDate: string
  contributorStatus: 'new' | 'pending' | 'approved' | 'verified'
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [stats, setStats] = useState({
    totalImages: 0,
    publishedImages: 0,
    approvedImages: 0,
    pendingImages: 0,
    totalEarnings: 0,
    totalViews: 0,
    totalDownloads: 0
  })
  const [recentImages, setRecentImages] = useState<Array<{id: string, name: string, views: number, downloads: number, status: string, earnings: number, trend: string, uploadDate: string}>>([])
  const [totalImages, setTotalImages] = useState(0)

  useEffect(() => {
    // Set client flag first
    setIsClient(true)
    
    // Get user information (simplified, server-safe approach)
    const getUserInfo = () => {
      // Default user for everyone initially
      const defaultUser: User = {
        name: 'Contributor',
        email: 'contributor@example.com',
        joinDate: new Date().toISOString(),
        contributorStatus: 'new' as const
      }
      
      // Only access localStorage after component mounts (client-side)
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          try {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
              const userData = JSON.parse(storedUser)
              setUser(userData)
            } else {
              // Check if this is first visit
              const isNewUser = !localStorage.getItem('hasVisitedDashboard')
              const newUser: User = {
                name: isNewUser ? 'New Contributor' : 'Contributor',
                email: 'contributor@example.com',
                joinDate: new Date().toISOString(),
                contributorStatus: 'new' as const
              }
              
              if (isNewUser) {
                localStorage.setItem('hasVisitedDashboard', 'true')
              }
              
              setUser(newUser)
            }
          } catch (error) {
            console.error('Error getting user info:', error)
            setUser(defaultUser)
          }
        }, 100) // Small delay to ensure client-side rendering
      }
      
      setUser(defaultUser)
      return defaultUser
    }

    // Initial load
    const updateStats = () => {
      const currentUser = getUserInfo()
      
      // For truly new users (no images uploaded), show zero stats
      if (currentUser?.contributorStatus === 'new' && typeof window !== 'undefined') {
        const hasAnyImages = localStorage.getItem('hasUploadedImages') === 'true'
        
        if (!hasAnyImages) {
          // New user with no activity - all zeros
          setStats({
            totalImages: 0,
            publishedImages: 0,
            approvedImages: 0,
            pendingImages: 0,
            totalEarnings: 0,
            totalViews: 0,
            totalDownloads: 0
          })
          setTotalImages(0)
          setRecentImages([])
          return
        }
      }
      
      // Existing users or users with uploaded images - show real data
      const newStats = imageStore.getStats()
      setStats(newStats)
      
      // Get recent images for the recent activity section
      const images = imageStore.getImages()
      setTotalImages(images.length) // Track total number of images
      const recent = images
        .slice(-4) // Last 4 images
        .reverse() // Most recent first
        .map((img) => ({
          id: img.id,
          name: img.metadata?.title || img.name,
          views: img.views,
          downloads: img.downloads,
          status: img.status === 'published' ? 'live' : 
                  img.status === 'approved' ? 'approved' :
                  ['submitted', 'quality-testing'].includes(img.status) ? 'pending' : 'processing',
          earnings: img.earnings,
          trend: 'neutral',
          uploadDate: getRelativeTime(img.uploadDate)
        }))
      setRecentImages(recent)
    }
    
    updateStats()
    
    // Subscribe to changes
    const unsubscribe = imageStore.subscribe(updateStats)
    return unsubscribe
  }, [])

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }


  // Get personalized greeting based on time of day and user status
  const getPersonalizedGreeting = () => {
    if (!isClient || !user) {
      return 'Welcome to Your Dashboard!'
    }
    
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
    const userName = user.name || 'Contributor'
    
    if (user.contributorStatus === 'new') {
      return `Welcome to Alamy, ${userName}!`
    } else if (user.contributorStatus === 'verified') {
      return `Good ${timeOfDay}, ${userName}!`
    } else {
      return `Good ${timeOfDay}, ${userName}!`
    }
  }

  // Enhanced performance insights based on user status and real data
  const insights = [
    // New user welcome insight
    ...(user?.contributorStatus === 'new' && stats.totalImages === 0 ? [{
      type: 'info' as const,
      title: 'Welcome to Your Contributor Journey!',
      message: 'Get started by uploading your first high-quality images. Our AI will help with metadata to maximize your earning potential.',
      action: 'Upload your first images'
    }] : []),
    
    // First-time upload completed
    ...(user?.contributorStatus === 'pending' && stats.totalImages > 0 && stats.publishedImages === 0 ? [{
      type: 'warning' as const,
      title: 'Great Start! Quality Review in Progress',
      message: `You&apos;ve uploaded ${stats.totalImages} image${stats.totalImages > 1 ? 's' : ''}. Our quality team is reviewing them now.`,
      action: 'Check review status'
    }] : []),
    
    // Quality approved
    ...(stats.approvedImages > 0 ? [{ 
      type: 'success' as const, 
      title: 'Congratulations! Quality Approved!', 
      message: `${stats.approvedImages} image${stats.approvedImages > 1 ? 's have' : ' has'} passed quality review and will be published soon.`,
      action: 'View approved images'
    }] : []),
    
    // Images live and earning
    ...(user?.contributorStatus === 'verified' && stats.publishedImages > 0 ? [{
      type: 'success' as const,
      title: 'You&apos;re Earning! 💰',
      message: `${stats.publishedImages} image${stats.publishedImages > 1 ? 's are' : ' is'} live and generating income. Keep uploading for more earnings!`,
      action: 'View earnings details'
    }] : []),
    
    // Pending review
    ...(stats.pendingImages > 0 ? [{ 
      type: 'warning' as const, 
      title: 'Review in Progress', 
      message: `${stats.pendingImages} image${stats.pendingImages > 1 ? 's are' : ' is'} currently under quality review.`,
      action: 'Check submission status'
    }] : []),
    
    // Performance insights for active contributors
    ...(stats.totalViews > 0 ? [{
      type: 'info' as const,
      title: 'Your View Performance',
      message: `Your images have been viewed ${stats.totalViews.toLocaleString()} times. Views are up 8.2% from last month!`,
      action: 'See detailed analytics'
    }] : []),
    
    // Download rate insight
    ...(stats.totalDownloads > 0 && stats.totalViews > 0 ? [{
      type: stats.totalDownloads / stats.totalViews > 0.02 ? 'success' as const : 'info' as const,
      title: 'Download Conversion Rate',
      message: `${((stats.totalDownloads / stats.totalViews) * 100).toFixed(1)}% of viewers download your images. ${stats.totalDownloads / stats.totalViews > 0.02 ? 'Excellent conversion!' : 'Room for improvement with better keywords.'}`,
      action: 'Optimize metadata'
    }] : []),
    
    // Earnings performance
    ...(stats.totalEarnings > 0 ? [{
      type: 'success' as const,
      title: 'Earnings Growth',
      message: `You've earned $${stats.totalEarnings.toFixed(2)} total. Earnings are up 12.5% from last month!`,
      action: 'View payout details'
    }] : []),
    
    // Encourage more uploads for established users
    ...(user?.contributorStatus === 'verified' && stats.totalImages < 10 ? [{
      type: 'info' as const,
      title: 'Grow Your Portfolio',
      message: 'Upload more diverse, high-quality images to increase your earning potential and reach more customers.',
      action: 'Upload more images'
    }] : []),
    
    // Weekly upload goal
    ...(stats.totalImages > 0 ? [{
      type: 'info' as const,
      title: 'Weekly Upload Goal',
      message: 'Contributors who upload 5+ images per week earn 3x more. You have 3 uploads this week.',
      action: 'Upload more this week'
    }] : []),
    
    // Default fallback for completely new users
    ...(stats.totalImages === 0 && !user ? [{ 
      type: 'info' as const, 
      title: 'Start Your Journey', 
      message: 'Upload your first images to begin earning from your photography.',
      action: 'Get started now'
    }] : [])
  ]

  // Show enhanced loading state during hydration
  if (!isClient) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {getPersonalizedGreeting()}
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>
            {user?.contributorStatus === 'new' && stats.totalImages === 0 
              ? 'Ready to start your photography journey? Upload your first images to begin earning!'
              : user?.contributorStatus === 'verified' 
                ? `You have ${stats.pendingImages} images pending review and $${stats.totalEarnings.toFixed(2)} total earnings.`
                : `You have ${stats.pendingImages} images pending review and $${stats.totalEarnings.toFixed(2)} total earnings.`
            }
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="upload-button px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          style={{
            borderRadius: 'var(--radius-4)'
          }}
          onClick={() => window.location.href = '/dashboard/upload'}
        >
          <Upload className="h-5 w-5" />
          <span>Upload Images</span>
        </motion.button>
      </div>

      {/* Stats Grid - Perfect Alignment */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-tertiary)',
            borderRadius: 'var(--radius-4)',
            padding: 'var(--spacing-5)',
            height: '160px', // Fixed height for perfect alignment
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Images className="h-8 w-8" style={{ color: 'var(--icon-secondary)' }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>
                  Total Images
                </dt>
                <dd className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalImages}
                </dd>
              </dl>
            </div>
          </div>
          <div 
            className="px-4 py-3 -mx-6 -mb-6 mt-4 rounded-b-xl" 
            style={{ 
              backgroundColor: 'var(--surface-tertiary)',
              borderRadius: '0 0 var(--radius-4) var(--radius-4)' 
            }}
          >
            <div className="text-sm">
              <span className="font-medium" style={{ color: 'var(--surface-brand)' }}>{stats.publishedImages} published</span>
              <span style={{ color: 'var(--text-tertiary)' }}> • {stats.pendingImages} pending</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-tertiary)',
            borderRadius: 'var(--radius-4)',
            padding: 'var(--spacing-5)',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8" style={{ color: 'var(--icon-secondary)' }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>
                  Total Earnings
                </dt>
                <dd className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  ${stats.totalEarnings.toFixed(2)}
                </dd>
              </dl>
            </div>
          </div>
          <div 
            className="px-4 py-3 -mx-6 -mb-6 mt-4 rounded-b-xl" 
            style={{ 
              backgroundColor: 'var(--surface-tertiary)',
              borderRadius: '0 0 var(--radius-4) var(--radius-4)' 
            }}
          >
            <div className="text-sm">
              {stats.totalEarnings > 0 ? (
                <>
                  <span className="font-medium" style={{ color: 'var(--surface-brand)' }}>+12.5%</span>
                  <span style={{ color: 'var(--text-tertiary)' }}> from last month</span>
                </>
              ) : (
                <span style={{ color: 'var(--text-tertiary)' }}>Start earning by uploading images</span>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-tertiary)',
            borderRadius: 'var(--radius-4)',
            padding: 'var(--spacing-5)',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8" style={{ color: 'var(--icon-secondary)' }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>
                  Total Views
                </dt>
                <dd className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalViews.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
          <div 
            className="px-4 py-3 -mx-6 -mb-6 mt-4 rounded-b-xl" 
            style={{ 
              backgroundColor: 'var(--surface-tertiary)',
              borderRadius: '0 0 var(--radius-4) var(--radius-4)' 
            }}
          >
            <div className="text-sm">
              {stats.totalViews > 0 ? (
                <>
                  <span className="font-medium" style={{ color: 'var(--surface-brand)' }}>+8.2%</span>
                  <span style={{ color: 'var(--text-tertiary)' }}> from last month</span>
                </>
              ) : (
                <span style={{ color: 'var(--text-tertiary)' }}>Views will show after upload</span>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-tertiary)',
            borderRadius: 'var(--radius-4)',
            padding: 'var(--spacing-5)',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Download className="h-8 w-8" style={{ color: 'var(--icon-secondary)' }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>
                  Total Downloads
                </dt>
                <dd className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalDownloads}
                </dd>
              </dl>
            </div>
          </div>
          <div 
            className="px-4 py-3 -mx-6 -mb-6 mt-4 rounded-b-xl" 
            style={{ 
              backgroundColor: 'var(--surface-tertiary)',
              borderRadius: '0 0 var(--radius-4) var(--radius-4)' 
            }}
          >
            <div className="text-sm">
              {stats.totalDownloads > 0 ? (
                <>
                  <span className="font-medium" style={{ color: 'var(--surface-brand)' }}>+15.3%</span>
                  <span style={{ color: 'var(--text-tertiary)' }}> from last month</span>
                </>
              ) : (
                <span style={{ color: 'var(--text-tertiary)' }}>Downloads will show after sales</span>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-tertiary)',
            borderRadius: 'var(--radius-4)',
            padding: 'var(--spacing-5)',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Heart className="h-8 w-8" style={{ color: 'var(--icon-secondary)' }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>
                  Collections
                </dt>
                <dd className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  0
                </dd>
              </dl>
            </div>
          </div>
          <div 
            className="px-4 py-3 -mx-6 -mb-6 mt-4 rounded-b-xl" 
            style={{ 
              backgroundColor: 'var(--surface-tertiary)',
              borderRadius: '0 0 var(--radius-4) var(--radius-4)' 
            }}
          >
            <div className="text-sm">
              <span style={{ color: 'var(--text-tertiary)' }}>Collections will grow over time</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
          style={{
            backgroundColor: 'var(--surface-secondary)',
            border: '1px solid var(--border-tertiary)',
            borderRadius: 'var(--radius-4)',
            padding: 'var(--spacing-5)',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8" style={{ color: 'var(--icon-secondary)' }} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium truncate" style={{ color: 'var(--text-tertiary)' }}>
                  Monthly Goal
                </dt>
                <dd className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalEarnings > 0 ? '73%' : '0%'}
                </dd>
              </dl>
            </div>
          </div>
          <div 
            className="px-4 py-3 -mx-6 -mb-6 mt-4 rounded-b-xl" 
            style={{ 
              backgroundColor: 'var(--surface-tertiary)',
              borderRadius: '0 0 var(--radius-4) var(--radius-4)' 
            }}
          >
            <div className="text-sm">
              {stats.totalEarnings > 0 ? (
                <>
                  <span className="font-medium" style={{ color: 'var(--surface-brand)' }}>$1,712</span>
                  <span style={{ color: 'var(--text-tertiary)' }}> of $2,500 goal</span>
                </>
              ) : (
                <span style={{ color: 'var(--text-tertiary)' }}>Set goals after first earnings</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl shadow-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-secondary)'
        }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-tertiary)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Performance Insights</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                style={{ 
                  backgroundColor: 'transparent',
                  border: insight.type === 'success' ? '1px solid var(--surface-brand)' :
                         insight.type === 'warning' ? '1px solid var(--surface-orange)' :
                         '1px solid var(--border-tertiary)',
                  minHeight: '140px'
                }}
              >
                {/* Top accent bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    backgroundColor: insight.type === 'success' ? 'var(--surface-brand)' :
                                   insight.type === 'warning' ? 'var(--surface-orange)' :
                                   'var(--icon-secondary)'
                  }}
                />
                
                <div className="p-4 h-full flex flex-col">
                  {/* Icon and Title */}
                  <div className="flex items-start space-x-3 mb-3">
                    <div 
                      className="flex-shrink-0 p-2 rounded-md"
                      style={{ 
                        backgroundColor: insight.type === 'success' ? 'rgba(0, 255, 123, 0.1)' :
                                       insight.type === 'warning' ? 'rgba(255, 152, 0, 0.1)' :
                                       'rgba(67, 67, 67, 0.3)'
                      }}
                    >
                      {insight.type === 'success' && <CheckCircle className="h-4 w-4" style={{ color: 'var(--surface-brand)' }} />}
                      {insight.type === 'warning' && <AlertCircle className="h-4 w-4" style={{ color: 'var(--surface-orange)' }} />}
                      {insight.type === 'info' && <Target className="h-4 w-4" style={{ color: 'var(--icon-secondary)' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                        {insight.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-tertiary)' }}>
                    {insight.message}
                  </p>
                  
                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-xs font-medium py-2 px-3 rounded-md transition-all duration-200 hover:shadow-sm"
                    style={{ 
                      backgroundColor: insight.type === 'success' ? 'var(--surface-brand)' :
                                     insight.type === 'warning' ? 'var(--surface-orange)' :
                                     'var(--surface-tertiary)',
                      color: insight.type !== 'info' ? '#000000' : 'var(--text-primary)',
                      border: insight.type === 'info' ? '1px solid var(--border-secondary)' : 'none',
                      borderRadius: 'var(--radius-3)'
                    }}
                    onMouseEnter={(e) => {
                      if (insight.type === 'info') {
                        e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'
                        e.currentTarget.style.borderColor = 'var(--border-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (insight.type === 'info') {
                        e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
                        e.currentTarget.style.borderColor = 'var(--border-secondary)'
                      }
                    }}
                  >
                    {insight.action}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Images */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 'var(--radius-4)'
        }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-tertiary)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Recent Images</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between py-3 px-4 rounded-lg"
                style={{ backgroundColor: 'rgba(67, 67, 67, 0.3)', borderRadius: 'var(--radius-4)' }}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface-primary)', borderRadius: 'var(--radius-3)' }}>
                    <Images className="h-6 w-6" style={{ color: 'var(--icon-secondary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{image.name}</h3>
                      <div className="flex items-center space-x-1 ml-2">
                        {image.trend === 'up' && <TrendingUp className="h-4 w-4" style={{ color: 'var(--surface-brand)' }} />}
                        {image.trend === 'down' && <TrendingUp className="h-4 w-4 rotate-180" style={{ color: 'var(--surface-orange)' }} />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        <span className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{image.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{image.downloads}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{image.uploadDate}</span>
                        </span>
                      </div>
                      {image.earnings > 0 && (
                        <span className="text-sm font-semibold" style={{ color: 'var(--surface-brand)' }}>
                          +${image.earnings.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center ml-4 flex-shrink-0">
                  {image.status === 'live' ? (
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--surface-brand)',
                        color: '#000000'
                      }}
                    >
                      Live
                    </span>
                  ) : (
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--surface-orange)',
                        color: '#000000'
                      }}
                    >
                      Pending
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {totalImages > 4 && (
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-medium hover:underline"
                style={{ color: 'var(--text-primary)' }}
                onClick={() => window.location.href = '/dashboard/images'}
              >
                View All Images →
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>


      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6"
        style={{ 
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 'var(--radius-4)'
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          {user?.contributorStatus === 'new' ? 'Getting Started Tips' : 'Tips to Boost Your Sales'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Upload Consistently</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Regular uploads keep your portfolio fresh and increase visibility in search results.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Use Relevant Keywords</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Optimize your image titles and tags to help buyers find your content more easily.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Follow Trends</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Stay updated with current design trends and seasonal demands for better sales.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>High Quality Only</h3>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Focus on technical excellence and commercial appeal to maintain high acceptance rates.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}