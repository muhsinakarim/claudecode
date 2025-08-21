'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, CheckCircle, XCircle, Clock, Image as ImageIcon, Camera, Award, Info, ArrowRight } from 'lucide-react'
import AlamyLogo from '../../components/AlamyLogo'

export default function QualityCheckPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'))
    setFiles(prev => [...prev, ...imageFiles].slice(0, 5)) // Max 5 images
  }, [])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleStartAssessment = () => {
    setCurrentStep(2)
  }

  const handleSubmit = async () => {
    if (files.length === 0) return

    setUploading(true)

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('images', file))

      const response = await fetch('/api/quality-check', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setSubmitted(true)
        setCurrentStep(3)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleContinueToBankDetails = () => {
    router.push('/bank-details')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: 'var(--surface-secondary)', border: '1px solid var(--border-secondary)' }}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <AlamyLogo width={48} height={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Quality Assessment
            </h1>
            <p style={{ color: 'var(--text-tertiary)' }}>
              Complete your quality check to start uploading and selling your images
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step 
                        ? 'text-black' 
                        : 'border-2'
                    }`}
                    style={{ 
                      backgroundColor: currentStep >= step ? 'var(--surface-brand)' : 'transparent',
                      borderColor: currentStep >= step ? 'var(--surface-brand)' : 'var(--border-tertiary)',
                      color: currentStep >= step ? '#000000' : 'var(--text-tertiary)'
                    }}
                  >
                    {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div 
                      className="w-12 h-0.5 mx-2"
                      style={{ 
                        backgroundColor: currentStep > step ? 'var(--surface-brand)' : 'var(--border-tertiary)'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Introduction */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(0, 255, 123, 0.1)' }}>
                  <Camera className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--surface-brand)' }} />
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Submit Test Images
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Upload 3-5 of your best images for quality review
                  </p>
                </div>
                
                <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(0, 255, 123, 0.1)' }}>
                  <Award className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--surface-brand)' }} />
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Quick Review
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Our team reviews your work within 24-48 hours
                  </p>
                </div>
                
                <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(0, 255, 123, 0.1)' }}>
                  <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--surface-brand)' }} />
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Add Bank Details
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Provide payment information to receive earnings
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: 'rgba(2, 169, 243, 0.1)', borderColor: 'var(--color-blue-500)' }}>
                <div className="flex">
                  <Info className="h-5 w-5 mt-0.5 mr-3" style={{ color: 'var(--color-blue-500)' }} />
                  <div className="text-left">
                    <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Quality Guidelines</h4>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      Images should be high resolution (minimum 4MP), properly exposed, sharp, and commercially viable. 
                      Avoid heavily filtered images, poor lighting, or copyrighted content.
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleStartAssessment}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 mx-auto transition-all duration-200"
                style={{
                  backgroundColor: 'var(--surface-brand)',
                  color: '#000000',
                  borderRadius: 'var(--radius-4)'
                }}
              >
                <span style={{ color: '#000000' }}>Start Quality Assessment</span>
                <ArrowRight className="h-5 w-5" style={{ color: '#000000' }} />
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Upload Test Images */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Upload Your Best Work
                </h2>
                <p style={{ color: 'var(--text-tertiary)' }}>
                  Submit 3-5 high-quality images that represent your photography style
                </p>
              </div>

              {files.length === 0 ? (
                <div 
                  className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-brand"
                  style={{ 
                    borderColor: 'var(--border-tertiary)',
                    backgroundColor: 'var(--surface-primary)'
                  }}
                  onClick={() => document.getElementById('file-input')?.click()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--surface-brand)'
                    e.currentTarget.style.backgroundColor = 'rgba(0, 255, 123, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-tertiary)'
                    e.currentTarget.style.backgroundColor = 'var(--surface-primary)'
                  }}
                >
                  <Upload className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Drag and drop your images here
                  </h3>
                  <p className="mb-4" style={{ color: 'var(--text-tertiary)' }}>
                    or click to browse your files
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-moderate)' }}>
                    Supported formats: JPG, PNG, TIFF • Maximum size: 50MB per image
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      onDrop(files)
                    }}
                    className="hidden"
                  />
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                      >
                        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-tertiary)' }}>
                          <div className="aspect-square rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--surface-tertiary)' }}>
                            <ImageIcon className="h-8 w-8" style={{ color: 'var(--text-tertiary)' }} />
                          </div>
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {file.name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: 'var(--color-red-500)', color: 'white' }}
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    
                    {files.length < 5 && (
                      <div
                        className="border-2 border-dashed rounded-xl p-4 flex items-center justify-center cursor-pointer transition-colors min-h-[200px]"
                        style={{ borderColor: 'var(--border-tertiary)' }}
                        onClick={() => document.getElementById('file-input')?.click()}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--surface-brand)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-tertiary)'
                        }}
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--text-tertiary)' }} />
                          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Add more</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <motion.button
                      onClick={handleSubmit}
                      disabled={uploading || files.length === 0}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
                      style={{
                        backgroundColor: 'var(--surface-brand)',
                        color: '#000000',
                        borderRadius: 'var(--radius-4)'
                      }}
                    >
                      {uploading ? 'Submitting for Review...' : 'Submit for Review'}
                    </motion.button>
                  </div>

                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      onDrop(files)
                    }}
                    className="hidden"
                  />
                </div>
              )}

              {/* Upload Guidelines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-tertiary)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>✅ Good Examples</h4>
                  <ul className="space-y-1" style={{ color: 'var(--text-tertiary)' }}>
                    <li>• High resolution and sharp focus</li>
                    <li>• Good lighting and composition</li>
                    <li>• Commercially viable subjects</li>
                    <li>• Minimal or tasteful editing</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-tertiary)' }}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>❌ Avoid</h4>
                  <ul className="space-y-1" style={{ color: 'var(--text-tertiary)' }}>
                    <li>• Blurry or low resolution images</li>
                    <li>• Heavy filters or over-processing</li>
                    <li>• Copyrighted or trademarked content</li>
                    <li>• Poor lighting or composition</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 255, 123, 0.2)' }}>
                <CheckCircle className="h-12 w-12" style={{ color: 'var(--surface-brand)' }} />
              </div>
              
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Assessment Submitted Successfully!
              </h2>
              
              <p className="mb-6" style={{ color: 'var(--text-tertiary)' }}>
                Your images have been submitted for quality review. Our team will review your work within 24-48 hours 
                and notify you via email once the assessment is complete.
              </p>

              <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: 'rgba(0, 255, 123, 0.1)', border: '1px solid rgba(0, 255, 123, 0.3)' }}>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Congratulations! Quality Assessment Passed!</h3>
                <div className="space-y-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  <p>✅ Your test images meet Alamy&apos;s quality standards</p>
                  <p>💳 Next step: Add your bank details to receive payments</p>
                  <p>🎯 Once complete, you&apos;ll become a verified contributor</p>
                  <p>💰 Start earning from your photography immediately</p>
                </div>
              </div>

              <motion.button
                onClick={handleContinueToBankDetails}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-lg font-semibold transition-all duration-200"
                style={{
                  backgroundColor: 'var(--surface-brand)',
                  color: '#000000',
                  borderRadius: 'var(--radius-4)'
                }}
              >
                Add Bank Details
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}