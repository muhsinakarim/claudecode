'use client'

import { motion } from 'framer-motion'
import { Clock, Mail, MessageCircle, Smartphone } from 'lucide-react'

export default function QualityCheckPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#000000' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#1a1a1a' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#1e3a8a' }}
          >
            <Clock className="h-10 w-10 text-blue-400" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-gray-100 mb-4">
            Quality Check In Progress
          </h1>
          
          <p className="text-gray-300 mb-8">
            Our team is reviewing your images. This process usually takes 24-48 hours.
          </p>
          
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              You&apos;ll be notified via:
            </h3>
            
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Email</span>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">WhatsApp</span>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Mobile</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>What happens next?</strong><br />
              If approved, you&apos;ll be prompted to add your bank details for payouts. 
              If not approved, you can resubmit with improved images.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}