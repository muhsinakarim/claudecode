'use client'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangle' | 'circle'
  width?: string | number
  height?: string | number
}

const Skeleton = ({ 
  className = '', 
  variant = 'rectangle', 
  width = '100%', 
  height = '1rem' 
}: SkeletonProps) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded'
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangle: 'rounded-lg',
    circle: 'rounded-full'
  }

  const styles = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    backgroundColor: 'var(--surface-tertiary)',
    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    backgroundSize: '200% 100%',
    animation: 'skeleton 1.5s ease-in-out infinite'
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={styles}
    />
  )
}

// Dashboard specific skeleton components
export const DashboardSkeleton = () => (
  <div className="max-w-6xl mx-auto p-6 space-y-8">
    {/* Header skeleton */}
    <div className="space-y-2">
      <Skeleton width="300px" height="32px" />
      <Skeleton width="200px" height="20px" />
    </div>
    
    {/* Stats grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-tertiary)' }}>
          <Skeleton width="100px" height="16px" />
          <Skeleton width="80px" height="32px" />
          <Skeleton width="60px" height="14px" />
        </div>
      ))}
    </div>
    
    {/* Content sections skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-tertiary)' }}>
        <Skeleton width="150px" height="24px" className="mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton variant="circle" width="40px" height="40px" />
              <div className="flex-1 space-y-2">
                <Skeleton width="80%" height="16px" />
                <Skeleton width="60%" height="12px" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-tertiary)' }}>
        <Skeleton width="120px" height="24px" className="mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton width="40%" height="16px" />
              <Skeleton width="60px" height="16px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export const FormSkeleton = () => (
  <div className="max-w-md mx-auto space-y-6">
    <div className="text-center space-y-2">
      <Skeleton width="200px" height="32px" className="mx-auto" />
      <Skeleton width="150px" height="16px" className="mx-auto" />
    </div>
    
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton width="100px" height="16px" />
          <Skeleton width="100%" height="48px" />
        </div>
      ))}
    </div>
    
    <Skeleton width="100%" height="48px" />
  </div>
)

export const CardSkeleton = () => (
  <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-tertiary)' }}>
    <div className="flex items-center space-x-4">
      <Skeleton variant="circle" width="48px" height="48px" />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height="20px" />
        <Skeleton width="40%" height="16px" />
      </div>
    </div>
    <Skeleton width="100%" height="100px" />
    <div className="flex justify-between items-center">
      <Skeleton width="80px" height="16px" />
      <Skeleton width="60px" height="32px" />
    </div>
  </div>
)

export default Skeleton