'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Download, Heart, MoreHorizontal, Clock, Upload, TrendingUp } from 'lucide-react'
import { imageStore } from '../../../lib/imageStore'

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

export default function ImagesPage() {
  const [images, setImages] = useState<ImageData[]>([])
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')

  useEffect(() => {
    const updateImages = () => {
      const allImages = imageStore.getImages()
      setImages(allImages)
      filterImages(allImages, searchQuery, statusFilter)
    }

    updateImages()
    const unsubscribe = imageStore.subscribe(updateImages)
    return unsubscribe
  }, [])

  useEffect(() => {
    filterImages(images, searchQuery, statusFilter)
  }, [images, searchQuery, statusFilter])

  const filterImages = (allImages: ImageData[], search: string, status: string) => {
    let filtered = allImages

    // Filter by status
    if (status !== 'All Status') {
      filtered = filtered.filter(img => {
        const displayStatus = getDisplayStatus(img.status)
        return displayStatus === status
      })
    }

    // Filter by search query
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(img => 
        img.name.toLowerCase().includes(searchLower) ||
        img.metadata?.title?.toLowerCase().includes(searchLower) ||
        img.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    setFilteredImages(filtered)
  }

  const getDisplayStatus = (status: ImageData['status']) => {
    switch (status) {
      case 'published': return 'Live'
      case 'approved': return 'Approved' 
      case 'submitted':
      case 'quality-testing': return 'Pending'
      case 'completed': return 'Ready'
      default: return 'Processing'
    }
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `uploaded ${diffMins} minutes ago`
    if (diffHours < 24) return `uploaded ${diffHours} hours ago`
    return `uploaded ${diffDays} days ago`
  }

  // const approvedCount = images.filter(img => img.status === 'approved').length

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">My Images</h1>
          <p className="mt-2 text-gray-300">
            Manage and track the performance of your uploaded images
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-colors" 
            style={{ 
              backgroundColor: 'var(--surface-primary)', 
              borderColor: 'var(--border-tertiary)', 
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-4)',
              minWidth: '140px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--border-brand)'
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 123, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-tertiary)'
              e.target.style.boxShadow = 'none'
            }}
          >
            <option style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>All Status</option>
            <option style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>Live</option>
            <option style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>Approved</option>
            <option style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>Pending</option>
            <option style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>Ready</option>
            <option style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>Processing</option>
          </select>
          <input 
            type="search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images..."
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-colors"
            style={{ 
              backgroundColor: 'var(--surface-primary)', 
              borderColor: 'var(--border-tertiary)', 
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-4)',
              minWidth: '200px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--border-brand)'
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 123, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-tertiary)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b" style={{ backgroundColor: '#2a2a2a', borderColor: '#404040' }}>
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-100">Image</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-100">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-100">Views</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-100">Downloads</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-100">Collections</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-100">Earnings</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-100"></th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#404040' }}>
              {filteredImages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Upload className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">
                      {images.length === 0 ? 'No images uploaded yet' : 'No images match your search'}
                    </h3>
                    <p className="text-gray-500">
                      {images.length === 0 
                        ? 'Start by uploading your first image'
                        : 'Try adjusting your search or filter criteria'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                filteredImages.map((image, index) => (
                  <motion.tr
                    key={image.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#404040' }}>
                          {image.preview ? (
                            <img src={image.preview} alt={image.metadata?.title || image.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-300 text-xs">IMG</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-100">{image.metadata?.title || image.name}</h3>
                          <p className="text-sm text-gray-400">{getRelativeTime(image.uploadDate)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getDisplayStatus(image.status) === 'Live' && (
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--surface-brand)',
                            color: '#000000'
                          }}
                        >
                          Live
                        </span>
                      )}
                      {getDisplayStatus(image.status) === 'Approved' && (
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--surface-brand)',
                            color: '#000000'
                          }}
                        >
                          Approved
                        </span>
                      )}
                      {getDisplayStatus(image.status) === 'Pending' && (
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
                      {getDisplayStatus(image.status) === 'Ready' && (
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: '#3b82f6',
                            color: '#ffffff'
                          }}
                        >
                          Ready
                        </span>
                      )}
                      {getDisplayStatus(image.status) === 'Processing' && (
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: '#fbbf24',
                            color: '#000000'
                          }}
                        >
                          Processing
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Eye className="h-4 w-4" />
                        <span>{image.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Download className="h-4 w-4" />
                        <span>{image.downloads}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Heart className="h-4 w-4" />
                        <span>0</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-green-400">
                        ${image.earnings.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {image.status === 'approved' && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-blue-400">
                            <Clock className="h-3 w-3" />
                            Awaiting Publication
                          </div>
                        )}
                        {image.status === 'published' && image.views > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-green-400">
                            <TrendingUp className="h-3 w-3" />
                            Earning
                          </div>
                        )}
                        <button className="text-gray-400 hover:text-gray-200">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}