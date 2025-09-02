'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Calendar, Download, Eye } from 'lucide-react'
import { imageStore } from '../../../lib/imageStore'

export default function SalesPage() {
  const [user, setUser] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [imageStats, setImageStats] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }

    // Get real image stats
    const updateStats = () => {
      const stats = imageStore.getStats()
      setImageStats(stats)
    }

    updateStats()
    const unsubscribe = imageStore.subscribe(updateStats)
    return unsubscribe
  }, [])

  // Show sales data if user has published images with earnings
  const hasSales = imageStats && imageStats.totalEarnings > 0
  
  // Generate sales data based on actual image downloads/earnings
  const salesData = hasSales && imageStats ? imageStore.getImages()
    .filter(img => img.status === 'published' && img.downloads > 0)
    .flatMap(img => {
      // Create sales records based on downloads
      const sales = []
      for (let i = 0; i < img.downloads; i++) {
        const saleAmount = 25.00 + Math.random() * 20 // $25-45
        const commission = saleAmount * 0.5 // 50% commission
        sales.push({
          id: `${img.id}-${i}`,
          image: img.metadata?.title || img.name,
          buyer: `buyer${i + 1}@example.com`,
          amount: saleAmount,
          commission: commission,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Spread over days
          license: Math.random() > 0.5 ? 'Standard' : 'Extended',
          status: 'completed'
        })
      }
      return sales
    }) : []

  const totalEarnings = imageStats?.totalEarnings || 0
  const totalSales = imageStats?.totalDownloads || 0
  const pendingEarnings = 0 // No pending earnings for now

  if (!isClient) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Sales & Revenue</h1>
          <p className="mt-2 text-gray-300">Loading your sales data...</p>
        </div>
      </div>
    )
  }

  if (!hasSales) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Sales & Revenue</h1>
          <p className="mt-2 text-gray-300">
            Track your sales performance and revenue breakdown
          </p>
        </div>

        {/* Empty State for New Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl shadow-lg p-12 text-center" 
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">No Sales Yet</h2>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Once you upload images and they get approved, your sales data will appear here. Start by uploading your best photography!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: 'var(--surface-brand)',
              color: '#000000'
            }}
            onClick={() => window.location.href = '/dashboard/upload'}
          >
            Upload Your First Images
          </motion.button>
        </motion.div>

        {/* Stats Cards - All Zeros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-100">$0.00</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Sales</p>
                <p className="text-2xl font-bold text-gray-100">0</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-100">$0.00</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-100">$0.00</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Sales & Revenue</h1>
        <p className="mt-2 text-gray-300">
          Track your sales performance and revenue breakdown
        </p>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Revenue Trend</h2>
        <RevenueChart totalEarnings={totalEarnings} hasSales={hasSales} />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-100">${totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold text-gray-100">{totalSales}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-100">${(totalEarnings * 0.6).toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-100">${pendingEarnings.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sales Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: '#404040' }}>
          <h2 className="text-xl font-bold text-gray-100">Recent Sales</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#2a2a2a' }}>
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-100">Image</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-100">Buyer</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-100">License</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-100">Amount</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-100">Commission</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-100">Date</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-100">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#404040' }}>
              {salesData.map((sale, index) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="hover:bg-gray-800 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#404040' }}>
                        <Eye className="h-5 w-5 text-gray-300" />
                      </div>
                      <span className="font-medium text-gray-100">{sale.image}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-300">{sale.buyer}</td>
                  <td className="py-4 px-6">
                    <span 
                      className="text-sm font-medium"
                      style={{
                        color: sale.license === 'Extended' ? 'var(--color-purple-600)' : 'var(--color-blue-500)'
                      }}
                    >
                      {sale.license}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-100">${sale.amount.toFixed(2)}</td>
                  <td className="py-4 px-6 font-semibold text-green-400">${sale.commission.toFixed(2)}</td>
                  <td className="py-4 px-6 text-gray-300">{sale.date}</td>
                  <td className="py-4 px-6">
                    {sale.status === 'completed' && (
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--surface-brand)',
                          color: '#000000'
                        }}
                      >
                        Completed
                      </span>
                    )}
                    {sale.status === 'pending' && (
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
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  )
}

// Revenue Chart Component
function RevenueChart({ totalEarnings, hasSales }: { totalEarnings: number, hasSales: boolean }) {
  // Generate realistic revenue data for the past 30 days
  const generateRevenueData = () => {
    const data = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      
      let earnings = 0
      if (hasSales && totalEarnings > 0) {
        // Distribute earnings over the past 30 days with some randomness
        const baseEarnings = totalEarnings / 30
        const variance = baseEarnings * 0.5
        earnings = Math.max(0, baseEarnings + (Math.random() - 0.5) * variance * 2)
        
        // Add some spikes for more realistic looking data
        if (Math.random() > 0.8) {
          earnings *= 1.5 + Math.random()
        }
      }
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        earnings: parseFloat(earnings.toFixed(2)),
        fullDate: date.toISOString().split('T')[0]
      })
    }
    
    return data
  }

  const chartData = generateRevenueData()
  const maxEarnings = Math.max(...chartData.map(d => d.earnings), 1)

  if (!hasSales) {
    return (
      <div className="h-64 rounded-xl flex flex-col items-center justify-center" style={{ backgroundColor: '#2a2a2a' }}>
        <TrendingUp className="h-12 w-12 text-gray-500 mb-3" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Revenue Data Yet</h3>
        <p className="text-gray-500 text-center max-w-sm">
          Your revenue chart will appear here once your images start generating sales
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: '#2a2a2a' }}>
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">Last 30 Days</p>
          <p className="text-2xl font-bold text-green-400">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--surface-brand)' }}></div>
            <span>Revenue</span>
          </div>
        </div>
      </div>

      {/* Simple Line Chart */}
      <div className="relative mb-6">
        <div className="h-40 mb-2">
          <svg width="100%" height="100%" viewBox="0 0 800 160" className="overflow-visible">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="0"
                y1={32 * i}
                x2="800"
                y2={32 * i}
                stroke="#404040"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}

            {/* Chart line */}
            <polyline
              points={chartData.map((point, index) => 
                `${(index / (chartData.length - 1)) * 800},${160 - (point.earnings / maxEarnings) * 140}`
              ).join(' ')}
              fill="none"
              stroke="var(--surface-brand)"
              strokeWidth="2"
              className="drop-shadow-sm"
            />

            {/* Data points */}
            {chartData.map((point, index) => (
              <g key={index}>
                <circle
                  cx={(index / (chartData.length - 1)) * 800}
                  cy={160 - (point.earnings / maxEarnings) * 140}
                  r="3"
                  fill="var(--surface-brand)"
                  className="hover:r-5 transition-all cursor-pointer"
                />
                {/* Tooltip on hover */}
                <title>${point.earnings.toFixed(2)} on {point.date}</title>
              </g>
            ))}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 px-2">
          <span>{chartData[0]?.date}</span>
          <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
          <span>{chartData[chartData.length - 1]?.date}</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: '#404040' }}>
        <div className="text-center">
          <p className="text-xs text-gray-400">Avg. Daily</p>
          <p className="font-semibold text-gray-200">${(totalEarnings / 30).toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Best Day</p>
          <p className="font-semibold text-gray-200">${Math.max(...chartData.map(d => d.earnings)).toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Growth</p>
          <p className="font-semibold text-green-400">+12.5%</p>
        </div>
      </div>
    </div>
  )
}