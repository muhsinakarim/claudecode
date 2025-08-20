'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, CheckCheck, Trash2, Clock, CheckCircle, AlertCircle, DollarSign, Image as ImageIcon } from 'lucide-react'
import { notificationStore } from '../lib/notificationStore'

interface NotificationData {
  id: string
  type: 'QUALITY_CHECK_PASSED' | 'QUALITY_CHECK_FAILED' | 'IMAGE_APPROVED' | 'IMAGE_REJECTED' | 'SALE_MADE' | 'PAYOUT_PROCESSED' | 'ACCOUNT_UPDATE'
  title: string
  message: string
  read: boolean
  channels: string[]
  sentAt: string | null
  createdAt: string
}

const getNotificationIcon = (type: NotificationData['type']) => {
  switch (type) {
    case 'QUALITY_CHECK_PASSED':
    case 'IMAGE_APPROVED':
      return <CheckCircle className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
    case 'QUALITY_CHECK_FAILED':
    case 'IMAGE_REJECTED':
      return <AlertCircle className="h-5 w-5" style={{ color: 'var(--surface-orange)' }} />
    case 'SALE_MADE':
    case 'PAYOUT_PROCESSED':
      return <DollarSign className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
    default:
      return <ImageIcon className="h-5 w-5" style={{ color: 'var(--icon-secondary)' }} />
  }
}

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(notificationStore.getNotifications())
      setUnreadCount(notificationStore.getUnreadCount())
    }

    updateNotifications()
    const unsubscribe = notificationStore.subscribe(updateNotifications)

    // Start polling for real-time updates (every 15 seconds for better responsiveness)
    const stopPolling = notificationStore.startPolling(15000)

    return () => {
      unsubscribe()
      stopPolling()
    }
  }, [])

  const handleMarkAsRead = async (notificationIds: string[]) => {
    setLoading(true)
    await notificationStore.markAsRead(notificationIds)
    setLoading(false)
  }

  const handleMarkAllAsRead = async () => {
    setLoading(true)
    await notificationStore.markAllAsRead()
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    await notificationStore.deleteNotification(id)
    setLoading(false)
  }

  const unreadNotifications = notifications.filter(n => !n.read)
  const recentNotifications = notifications.slice(0, 10)

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-colors"
        style={{ 
          backgroundColor: isOpen ? 'var(--surface-tertiary)' : 'transparent',
          color: 'var(--text-primary)'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <Bell className="h-6 w-6" />
        
        {/* Unread Count Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: 'var(--surface-orange)',
                color: '#000000'
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 w-96 rounded-xl shadow-2xl border z-50"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-secondary)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-tertiary)' }}>
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkAllAsRead}
                    disabled={loading}
                    className="text-sm px-2 py-1 rounded-md transition-colors"
                    style={{ 
                      color: 'var(--surface-brand)',
                      backgroundColor: 'rgba(0, 255, 123, 0.1)'
                    }}
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </motion.button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md transition-colors"
                  style={{ color: 'var(--icon-secondary)' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--icon-tertiary)' }} />
                  <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    No notifications yet
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {recentNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-4 py-3 border-l-2 hover:bg-opacity-50 transition-colors group ${
                        !notification.read ? 'border-l-blue-500' : 'border-l-transparent'
                      }`}
                      style={{
                        backgroundColor: !notification.read ? 'rgba(0, 255, 123, 0.05)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = !notification.read ? 'rgba(0, 255, 123, 0.05)' : 'transparent'
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`font-medium text-sm ${!notification.read ? 'font-semibold' : ''}`} style={{ color: 'var(--text-primary)' }}>
                                {notification.title}
                              </h4>
                              <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs" style={{ color: 'var(--text-quaternary)' }}>
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {getRelativeTime(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead([notification.id])}
                                  disabled={loading}
                                  className="p-1 rounded transition-colors"
                                  style={{ color: 'var(--surface-brand)' }}
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                disabled={loading}
                                className="p-1 rounded transition-colors"
                                style={{ color: 'var(--text-quaternary)' }}
                                title="Delete notification"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {recentNotifications.length > 0 && (
              <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border-tertiary)' }}>
                <button
                  className="text-sm w-full text-center py-2 rounded-md transition-colors"
                  style={{ 
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--surface-tertiary)'
                  }}
                  onClick={() => {
                    // TODO: Navigate to full notifications page
                    setIsOpen(false)
                  }}
                >
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}