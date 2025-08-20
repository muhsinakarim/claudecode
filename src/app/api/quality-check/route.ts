import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const formData = await request.formData()
    const images = formData.getAll('images') as File[]

    if (images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    let totalScore = 0
    const processedImages = []

    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer())
      
      // Analyze image with Sharp
      const metadata = await sharp(buffer).metadata()
      
      // Simple AI quality scoring (in a real app, you'd use proper AI models)
      let qualityScore = 0
      
      // Check resolution
      if (metadata.width && metadata.height) {
        const minDimension = Math.min(metadata.width, metadata.height)
        const maxDimension = Math.max(metadata.width, metadata.height)
        
        if (maxDimension >= 2000) qualityScore += 30
        if (minDimension >= 1500) qualityScore += 20
      }
      
      // Check file size (not too small, not too large)
      const fileSizeMB = image.size / 1024 / 1024
      if (fileSizeMB > 2 && fileSizeMB < 50) qualityScore += 20
      
      // Check format
      if (metadata.format === 'jpeg' || metadata.format === 'png') qualityScore += 10
      
      // Random quality factors (simulating AI analysis)
      qualityScore += Math.random() * 20 // 0-20 points for composition, lighting, etc.
      
      processedImages.push({
        filename: image.name,
        size: image.size,
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        qualityScore: Math.min(100, qualityScore)
      })
      
      totalScore += qualityScore
    }

    const averageScore = totalScore / images.length
    const passed = averageScore >= 70 // Threshold for passing

    // Update user's quality check status
    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        qualityCheckPassed: passed,
        qualityCheckDate: new Date(),
        status: passed ? 'ACTIVE' : 'REJECTED'
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: payload.userId,
        type: passed ? 'QUALITY_CHECK_PASSED' : 'QUALITY_CHECK_FAILED',
        title: passed ? 'Quality Check Passed!' : 'Quality Check Failed',
        message: passed 
          ? 'Congratulations! Your images have passed our quality check. You can now start uploading and selling your photos.'
          : `Your images didn't meet our quality standards. Average score: ${averageScore.toFixed(1)}/100. Please try again with higher quality images.`,
        channels: '["email", "mobile"]'
      }
    })

    return NextResponse.json({
      success: true,
      passed,
      averageScore: averageScore.toFixed(1),
      images: processedImages
    })

  } catch (error) {
    console.error('Quality check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}