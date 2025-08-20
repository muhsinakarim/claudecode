'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, CreditCard, Bell, Shield, Save, Edit, X } from 'lucide-react'

export default function SettingsPage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingBankDetails, setIsEditingBankDetails] = useState(false)
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: 'John Photographer',
    bankName: 'Chase Bank',
    accountNumber: '•••••••••••2345',
    routingNumber: '•••••••021'
  })

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSaveBankDetails = () => {
    setIsEditingBankDetails(false)
    // In a real app, you would save to the backend here
    console.log('Bank details saved:', bankDetails)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Account Settings</h1>
        <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          id="notifications"
          className="rounded-2xl shadow-lg p-6" 
          style={{ 
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="h-6 w-6" style={{ color: 'var(--surface-orange)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div 
              className="flex items-center justify-between p-4 border rounded-lg" 
              style={{ 
                borderColor: 'var(--border-tertiary)', 
                backgroundColor: 'rgba(85, 85, 85, 0.3)',
                borderRadius: 'var(--radius-4)'
              }}
            >
              <div>
                <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Email Notifications</h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Receive updates about sales and account activity</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" style={{ accentColor: 'var(--surface-brand)' }} />
            </div>
            
            <div 
              className="flex items-center justify-between p-4 border rounded-lg" 
              style={{ 
                borderColor: 'var(--border-tertiary)', 
                backgroundColor: 'rgba(85, 85, 85, 0.3)',
                borderRadius: 'var(--radius-4)'
              }}
            >
              <div>
                <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>WhatsApp Notifications</h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Get instant updates on your mobile</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" style={{ accentColor: 'var(--surface-brand)' }} />
            </div>
            
            <div 
              className="flex items-center justify-between p-4 border rounded-lg" 
              style={{ 
                borderColor: 'var(--border-tertiary)', 
                backgroundColor: 'rgba(85, 85, 85, 0.3)',
                borderRadius: 'var(--radius-4)'
              }}
            >
              <div>
                <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Push Notifications</h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Browser notifications for important updates</p>
              </div>
              <input type="checkbox" className="w-5 h-5" style={{ accentColor: 'var(--surface-brand)' }} />
            </div>
          </div>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          id="profile"
          className="rounded-2xl shadow-lg p-6" 
          style={{ 
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6" style={{ color: 'var(--icon-brand)' }} />
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>
            </div>
            {!isEditingProfile && (
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2" 
                style={{ 
                  backgroundColor: 'var(--surface-tertiary)', 
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-4)'
                }}
              >
                <Edit className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Edit</span>
              </button>
            )}
          </div>
          
          {!isEditingProfile ? (
            // Read-only view
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>First Name</label>
                  <div 
                    className="w-full px-4 py-3 rounded-lg" 
                    style={{ 
                      backgroundColor: 'var(--surface-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  >
                    John
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Last Name</label>
                  <div 
                    className="w-full px-4 py-3 rounded-lg" 
                    style={{ 
                      backgroundColor: 'var(--surface-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  >
                    Photographer
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Email Address</label>
                <div 
                  className="w-full px-4 py-3 rounded-lg" 
                  style={{ 
                    backgroundColor: 'var(--surface-tertiary)', 
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-4)'
                  }}
                >
                  john@example.com
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Bio</label>
                <div 
                  className="w-full px-4 py-3 rounded-lg min-h-[100px]" 
                  style={{ 
                    backgroundColor: 'var(--surface-tertiary)', 
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-4)'
                  }}
                >
                  Professional photographer specializing in landscape and street photography. I have been capturing moments for over 10 years and love sharing my work with the world.
                </div>
              </div>
            </div>
          ) : (
            // Edit mode
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>First Name</label>
                  <input 
                    type="text" 
                    defaultValue="John"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors" 
                    style={{ 
                      backgroundColor: 'var(--surface-primary)', 
                      borderColor: 'var(--border-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Last Name</label>
                  <input 
                    type="text" 
                    defaultValue="Photographer"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors" 
                    style={{ 
                      backgroundColor: 'var(--surface-primary)', 
                      borderColor: 'var(--border-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email Address</label>
                <input 
                  type="email" 
                  defaultValue="john@example.com"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors" 
                  style={{ 
                    backgroundColor: 'var(--surface-primary)', 
                    borderColor: 'var(--border-tertiary)', 
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-4)'
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Bio</label>
                <textarea 
                  rows={4}
                  defaultValue="Professional photographer specializing in landscape and street photography. I have been capturing moments for over 10 years and love sharing my work with the world."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors" 
                  style={{ 
                    backgroundColor: 'var(--surface-primary)', 
                    borderColor: 'var(--border-tertiary)', 
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-4)'
                  }}
                />
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2" 
                  style={{ 
                    backgroundColor: 'var(--surface-brand)', 
                    color: '#000000',
                    borderRadius: 'var(--radius-4)'
                  }}
                >
                  <Save className="h-5 w-5" style={{ color: '#000000' }} />
                  <span style={{ color: '#000000' }}>Save Changes</span>
                </button>
                
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2" 
                  style={{ 
                    backgroundColor: 'var(--surface-secondary)', 
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-4)',
                    border: '1px solid var(--border-secondary)'
                  }}
                >
                  <X className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>Cancel</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bank Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          id="bank-details"
          className="rounded-2xl shadow-lg p-6" 
          style={{ 
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6" style={{ color: 'var(--surface-brand)' }} />
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Bank Details</h2>
            </div>
            {!isEditingBankDetails && (
              <button 
                onClick={() => setIsEditingBankDetails(true)}
                className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2" 
                style={{ 
                  backgroundColor: 'var(--surface-tertiary)', 
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-4)'
                }}
              >
                <Edit className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Edit</span>
              </button>
            )}
          </div>
          
          {/* Security Notice - Always visible at top */}
          <div 
            className="p-4 rounded-lg border-l-4 mb-6" 
            style={{ 
              backgroundColor: 'rgba(0, 255, 123, 0.1)', 
              borderColor: 'var(--surface-brand)',
              borderRadius: 'var(--radius-4)'
            }}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" style={{ color: 'var(--surface-brand)' }} />
              <div>
                <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Secure & Encrypted</h4>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Your bank details are encrypted and stored securely. Only you can view the full details.
                </p>
              </div>
            </div>
          </div>
          
          {!isEditingBankDetails ? (
            // Read-only view
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Account Holder Name</label>
                  <div 
                    className="w-full px-4 py-3 rounded-lg" 
                    style={{ 
                      backgroundColor: 'var(--surface-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  >
                    {bankDetails.accountHolderName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Bank Name</label>
                  <div 
                    className="w-full px-4 py-3 rounded-lg" 
                    style={{ 
                      backgroundColor: 'var(--surface-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  >
                    {bankDetails.bankName}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Account Number</label>
                  <div 
                    className="w-full px-4 py-3 rounded-lg font-mono" 
                    style={{ 
                      backgroundColor: 'var(--surface-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  >
                    {bankDetails.accountNumber}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>Routing Number</label>
                  <div 
                    className="w-full px-4 py-3 rounded-lg font-mono" 
                    style={{ 
                      backgroundColor: 'var(--surface-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  >
                    {bankDetails.routingNumber}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit mode
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Account Holder Name</label>
                  <input 
                    type="text" 
                    name="accountHolderName"
                    value={bankDetails.accountHolderName}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors" 
                    style={{ 
                      backgroundColor: 'var(--surface-primary)', 
                      borderColor: 'var(--border-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Bank Name</label>
                  <input 
                    type="text" 
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors" 
                    style={{ 
                      backgroundColor: 'var(--surface-primary)', 
                      borderColor: 'var(--border-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Account Number</label>
                  <input 
                    type="text" 
                    name="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors font-mono" 
                    style={{ 
                      backgroundColor: 'var(--surface-primary)', 
                      borderColor: 'var(--border-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                    placeholder="Enter full account number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Routing Number</label>
                  <input 
                    type="text" 
                    name="routingNumber"
                    value={bankDetails.routingNumber}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors font-mono" 
                    style={{ 
                      backgroundColor: 'var(--surface-primary)', 
                      borderColor: 'var(--border-tertiary)', 
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-4)'
                    }}
                    placeholder="Enter routing number"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleSaveBankDetails}
                  className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2" 
                  style={{ 
                    backgroundColor: 'var(--surface-brand)', 
                    color: '#000000',
                    borderRadius: 'var(--radius-4)'
                  }}
                >
                  <Save className="h-5 w-5" style={{ color: '#000000' }} />
                  <span style={{ color: '#000000' }}>Save Changes</span>
                </button>
                
                <button 
                  onClick={() => setIsEditingBankDetails(false)}
                  className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2" 
                  style={{ 
                    backgroundColor: 'var(--surface-secondary)', 
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-4)',
                    border: '1px solid var(--border-secondary)'
                  }}
                >
                  <X className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>Cancel</span>
                </button>
              </div>
            </div>
          )}

        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          id="security"
          className="rounded-2xl shadow-lg p-6" 
          style={{ 
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="h-6 w-6" style={{ color: 'var(--color-red-600)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Security Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Current Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors" 
                style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-tertiary)', 
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-4)'
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors" 
                style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-tertiary)', 
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-4)'
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Confirm New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors" 
                style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-tertiary)', 
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-4)'
                }}
              />
            </div>

            <div 
              className="two-factor-auth flex items-center justify-between p-4 rounded-lg" 
              style={{ 
                borderRadius: 'var(--radius-4)',
                border: '1px solid var(--border-brand-moderate)'
              }}
            >
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm">Add an extra layer of security to your account</p>
              </div>
              <button 
                className="px-4 py-2 rounded-lg font-medium transition-colors" 
                style={{ 
                  backgroundColor: 'var(--surface-brand)', 
                  color: '#000000',
                  borderRadius: 'var(--radius-4)'
                }}
              >
                Enable
              </button>
            </div>

            <button 
              className="px-6 py-3 rounded-lg font-semibold transition-colors" 
              style={{ 
                backgroundColor: 'var(--surface-secondary)', 
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-4)',
                border: '1px solid var(--border-secondary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
                e.currentTarget.style.borderColor = 'var(--border-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'
                e.currentTarget.style.borderColor = 'var(--border-secondary)'
              }}
            >
              Update Password
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}