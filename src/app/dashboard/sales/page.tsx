'use client'

import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Calendar, Download, Eye } from 'lucide-react'

export default function SalesPage() {
  // Mock sales data
  const salesData = [
    { id: 1, image: 'Sunset Beach Photography', buyer: 'john@company.com', amount: 25.00, commission: 12.50, date: '2024-08-10', license: 'Standard', status: 'completed' },
    { id: 2, image: 'Urban City Skyline', buyer: 'sarah@agency.com', amount: 45.00, commission: 22.50, date: '2024-08-09', license: 'Extended', status: 'completed' },
    { id: 3, image: 'Coffee Cup Lifestyle', buyer: 'mike@startup.com', amount: 15.00, commission: 7.50, date: '2024-08-08', license: 'Standard', status: 'pending' },
    { id: 4, image: 'Mountain Landscape', buyer: 'lisa@blog.com', amount: 35.00, commission: 17.50, date: '2024-08-07', license: 'Extended', status: 'completed' },
  ]

  const totalEarnings = salesData.reduce((sum, sale) => sum + sale.commission, 0)
  const totalSales = salesData.length
  const pendingEarnings = salesData.filter(sale => sale.status === 'pending').reduce((sum, sale) => sum + sale.commission, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Sales & Revenue</h1>
        <p className="mt-2 text-gray-300">
          Track your sales performance and revenue breakdown
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
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
        transition={{ delay: 0.5 }}
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
                  transition={{ delay: 0.6 + index * 0.1 }}
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

      {/* Revenue Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: '#1a1a1a' }}
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Revenue Trend</h2>
        <div className="h-64 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2a2a2a' }}>
          <p className="text-gray-400">Chart visualization would go here</p>
        </div>
      </motion.div>
    </div>
  )
}