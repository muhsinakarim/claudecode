// Simple image store for tracking uploaded images across the app
import { notificationStore } from './notificationStore'
interface ImageData {
  id: string
  name: string
  preview: string
  status: 'uploading' | 'analyzing' | 'completed' | 'submitting' | 'submitted' | 'quality-testing' | 'approved' | 'published'
  progress: number
  uploadDate: string
  metadata?: {
    title: string
    caption: string
    keywords: string[]
    tags: string[]
    category: string
  }
  views: number
  downloads: number
  earnings: number
}

class ImageStore {
  private images: ImageData[] = []
  private listeners: Array<() => void> = []

  constructor() {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('contributor-images')
      if (stored) {
        try {
          this.images = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to load stored images:', e)
        }
      }
    }
  }

  addImages(images: Partial<ImageData>[]) {
    const newImages = images.map(img => ({
      views: 0,
      downloads: 0,
      earnings: 0,
      uploadDate: new Date().toISOString(),
      ...img
    })) as ImageData[]
    
    this.images.push(...newImages)
    this.persist()
    this.notifyListeners()
  }

  updateImageStatus(id: string, status: ImageData['status']) {
    const image = this.images.find(img => img.id === id)
    if (image) {
      const previousStatus = image.status
      image.status = status
      
      // Trigger notifications for status changes
      if (status === 'approved' && previousStatus !== 'approved') {
        // Notify when image gets approved
        notificationStore.notifyImageApproved(image.metadata?.title || image.name)
      }
      
      this.persist()
      this.notifyListeners()
    }
  }

  updateImageMetadata(id: string, metadata: Partial<ImageData['metadata']>) {
    const image = this.images.find(img => img.id === id)
    if (image) {
      image.metadata = { ...image.metadata, ...metadata } as ImageData['metadata']
      this.persist()
      this.notifyListeners()
    }
  }

  publishImage(id: string) {
    const image = this.images.find(img => img.id === id)
    if (image && image.status === 'approved') {
      image.status = 'published'
      this.persist()
      this.notifyListeners()
      
      // Start earning simulation for this image
      this.startEarningSimulation(id)
    }
  }

  publishAllApproved() {
    const approvedImages = this.images.filter(img => img.status === 'approved')
    approvedImages.forEach(img => {
      img.status = 'published'
      this.startEarningSimulation(img.id)
    })
    
    if (approvedImages.length > 0) {
      this.persist()
      this.notifyListeners()
    }
  }

  private startEarningSimulation(imageId: string) {
    // Simulate views, downloads, and earnings over time
    const intervals: NodeJS.Timeout[] = []
    
    // Initial burst of activity (first few hours)
    const initialInterval = setInterval(() => {
      this.simulateImageActivity(imageId, 'initial')
    }, 10000) // Every 10 seconds
    intervals.push(initialInterval)
    
    // Stop initial burst after 2 minutes (simulate first day activity)
    setTimeout(() => {
      clearInterval(initialInterval)
      
      // Start regular activity simulation
      const regularInterval = setInterval(() => {
        this.simulateImageActivity(imageId, 'regular')
      }, 30000) // Every 30 seconds
      intervals.push(regularInterval)
      
      // Clean up after 5 minutes (for demo purposes)
      setTimeout(() => {
        clearInterval(regularInterval)
      }, 300000) // 5 minutes
      
    }, 120000) // 2 minutes
  }

  private simulateImageActivity(imageId: string, phase: 'initial' | 'regular') {
    const image = this.images.find(img => img.id === imageId)
    if (!image || image.status !== 'published') return

    // Simulate based on image category and quality
    const category = image.metadata?.category || 'General'
    const popularity = this.getCategoryPopularity(category)
    
    // Views simulation
    const viewsIncrease = phase === 'initial' 
      ? Math.floor(Math.random() * 15 * popularity) + 1
      : Math.floor(Math.random() * 8 * popularity) + 1
    
    image.views += viewsIncrease

    // Downloads simulation (lower frequency)
    const downloadChance = phase === 'initial' ? 0.3 : 0.15
    if (Math.random() < downloadChance * popularity) {
      const previousDownloads = image.downloads
      const newDownloads = Math.floor(Math.random() * 3) + 1
      image.downloads += newDownloads
      
      // Earnings per download (varies by image quality/category)
      const earningsPerDownload = this.getEarningsRate(category)
      const newEarnings = earningsPerDownload * newDownloads
      image.earnings += newEarnings
      
      // Notify about sales (only for first few sales to avoid spam)
      if (image.downloads <= 5 && previousDownloads < image.downloads) {
        notificationStore.notifySale(
          image.metadata?.title || image.name, 
          newEarnings
        )
      }
    }

    this.persist()
    this.notifyListeners()
  }

  private getCategoryPopularity(category: string): number {
    const popularityMap: { [key: string]: number } = {
      'Nature & Landscape': 1.4,
      'People & Lifestyle': 1.3,
      'Food & Beverage': 1.2,
      'Business & Technology': 1.1,
      'Urban & Architecture': 1.0,
      'Artistic & Creative': 0.9,
      'Lifestyle & Wellness': 1.2,
      'General': 0.8
    }
    return popularityMap[category] || 1.0
  }

  private getEarningsRate(category: string): number {
    const earningsMap: { [key: string]: number } = {
      'Nature & Landscape': 2.5,
      'People & Lifestyle': 3.2,
      'Food & Beverage': 2.8,
      'Business & Technology': 4.1,
      'Urban & Architecture': 2.3,
      'Artistic & Creative': 1.9,
      'Lifestyle & Wellness': 3.0,
      'General': 1.8
    }
    return earningsMap[category] || 2.0
  }

  getImages(): ImageData[] {
    return [...this.images]
  }

  getImagesByStatus(status: ImageData['status']): ImageData[] {
    return this.images.filter(img => img.status === status)
  }

  getStats() {
    const published = this.getImagesByStatus('published')
    const approved = this.getImagesByStatus('approved')
    const pending = this.images.filter(img => 
      ['submitted', 'quality-testing'].includes(img.status)
    )
    
    return {
      totalImages: this.images.length,
      publishedImages: published.length,
      approvedImages: approved.length,
      pendingImages: pending.length,
      totalEarnings: published.reduce((sum, img) => sum + img.earnings, 0),
      totalViews: published.reduce((sum, img) => sum + img.views, 0),
      totalDownloads: published.reduce((sum, img) => sum + img.downloads, 0)
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('contributor-images', JSON.stringify(this.images))
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  // Utility method to clear all stored data (for cleaning up dummy data)
  clearAllData() {
    this.images = []
    this.persist()
    this.notifyListeners()
  }

  // Remove all images that are not live/published
  keepOnlyLiveImages() {
    const liveImages = this.images.filter(img => img.status === 'published')
    const removedCount = this.images.length - liveImages.length
    this.images = liveImages
    this.persist()
    this.notifyListeners()
    return { kept: liveImages.length, removed: removedCount }
  }

  // Utility method to get image count by status for debugging
  getDebugInfo() {
    return {
      total: this.images.length,
      byStatus: {
        uploading: this.getImagesByStatus('uploading').length,
        analyzing: this.getImagesByStatus('analyzing').length,
        completed: this.getImagesByStatus('completed').length,
        submitting: this.getImagesByStatus('submitting').length,
        submitted: this.getImagesByStatus('submitted').length,
        'quality-testing': this.getImagesByStatus('quality-testing').length,
        approved: this.getImagesByStatus('approved').length,
        published: this.getImagesByStatus('published').length,
      },
      images: this.images.map(img => ({
        id: img.id,
        name: img.name,
        status: img.status,
        uploadDate: img.uploadDate
      }))
    }
  }
}

// Global instance
export const imageStore = new ImageStore()