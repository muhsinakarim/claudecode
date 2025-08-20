'use client'

import { motion } from 'framer-motion'
import { XCircle, RefreshCw, Mail, MessageCircle, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function QualityCheckFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#000000' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#1a1a1a' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#7f1d1d' }}
          >
            <XCircle className="h-10 w-10 text-red-400" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-gray-100 mb-4">
            Quality Check Not Passed
          </h1>
          
          <p className="text-gray-300 mb-8">
            Your uploaded images didn&apos;t meet our quality standards this time. 
            Don&apos;t worry - you can try again with improved images!
          </p>
          
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              You were notified via:
            </h3>
            
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-sm text-gray-600">Email</span>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-sm text-gray-600">WhatsApp</span>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-sm text-gray-600">Mobile</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Tips for Better Images:</h3>
            <ul className="text-sm text-gray-700 space-y-2 text-left">
              <li>• Ensure high resolution (min 2000px on longest side)</li>
              <li>• Check for sharp focus and good lighting</li>
              <li>• Avoid over/under-exposed images</li>
              <li>• Use professional composition techniques</li>
              <li>• Ensure commercial viability of subjects</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/quality-check"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Try Quality Check Again</span>
            </Link>
            
            <Link
              href="/"
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}