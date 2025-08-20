// Notification store for managing notifications across the app
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

class NotificationStore {
  private notifications: NotificationData[] = []
  private listeners: Array<() => void> = []
  private unreadCount = 0

  constructor() {
    // Load notifications on initialization
    if (typeof window !== 'undefined') {
      this.fetchNotifications()
    }
  }

  async fetchNotifications(limit = 50) {
    try {
      const response = await fetch(`/api/notifications?limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        this.notifications = data.notifications || []
        this.updateUnreadCount()
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  async createNotification(notification: {
    type: NotificationData['type']
    title: string
    message: string
    channels?: string[]
  }) {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      })
      
      if (response.ok) {
        const data = await response.json()
        this.notifications.unshift(data.notification)
        this.updateUnreadCount()
        this.notifyListeners()
        return data.notification
      }
    } catch (error) {
      console.error('Failed to create notification:', error)
    }
    return null
  }

  async markAsRead(notificationIds: string[]) {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'markAsRead',
          notificationIds
        })
      })
      
      if (response.ok) {
        // Update local state
        this.notifications.forEach(notification => {
          if (notificationIds.includes(notification.id)) {
            notification.read = true
          }
        })
        this.updateUnreadCount()
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  async markAllAsRead() {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'markAllAsRead'
        })
      })
      
      if (response.ok) {
        // Update local state
        this.notifications.forEach(notification => {
          notification.read = true
        })
        this.updateUnreadCount()
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  async deleteNotification(id: string) {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        this.notifications = this.notifications.filter(n => n.id !== id)
        this.updateUnreadCount()
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  getNotifications(): NotificationData[] {
    return [...this.notifications]
  }

  getUnreadNotifications(): NotificationData[] {
    return this.notifications.filter(n => !n.read)
  }

  getUnreadCount(): number {
    return this.unreadCount
  }

  getNotificationsByType(type: NotificationData['type']): NotificationData[] {
    return this.notifications.filter(n => n.type === type)
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  // Helper methods for creating specific notification types
  async notifyImageApproved(imageTitle: string) {
    return this.createNotification({
      type: 'IMAGE_APPROVED',
      title: 'Image Approved! 🎉',
      message: `Your image "${imageTitle}" has been approved and is now live on the marketplace.`,
      channels: ['email']
    })
  }

  async notifyImageRejected(imageTitle: string, reason?: string) {
    return this.createNotification({
      type: 'IMAGE_REJECTED',
      title: 'Image Needs Attention',
      message: `Your image "${imageTitle}" was rejected. ${reason ? `Reason: ${reason}` : 'Please review our quality guidelines.'}`,
      channels: ['email']
    })
  }

  async notifyQualityCheckPassed() {
    return this.createNotification({
      type: 'QUALITY_CHECK_PASSED',
      title: 'Quality Check Passed! ✅',
      message: 'Congratulations! Your portfolio has passed our quality review. You can now start uploading and selling images.',
      channels: ['email']
    })
  }

  async notifyQualityCheckFailed() {
    return this.createNotification({
      type: 'QUALITY_CHECK_FAILED',
      title: 'Quality Check Review',
      message: 'Your portfolio needs some improvements. Please review our guidelines and resubmit.',
      channels: ['email']
    })
  }

  async notifySale(imageTitle: string, amount: number) {
    return this.createNotification({
      type: 'SALE_MADE',
      title: 'New Sale! 💰',
      message: `Your image "${imageTitle}" was sold for $${amount.toFixed(2)}. Earnings will be processed in your next payout.`,
      channels: ['email']
    })
  }

  async notifyPayoutProcessed(amount: number) {
    return this.createNotification({
      type: 'PAYOUT_PROCESSED',
      title: 'Payout Processed',
      message: `Your payout of $${amount.toFixed(2)} has been processed and will arrive in your account within 2-3 business days.`,
      channels: ['email']
    })
  }

  // Start periodic refresh for real-time updates
  startPolling(intervalMs = 30000) {
    if (typeof window === 'undefined') return

    const interval = setInterval(() => {
      this.fetchNotifications()
    }, intervalMs)

    return () => clearInterval(interval)
  }
}

// Global instance
export const notificationStore = new NotificationStore()