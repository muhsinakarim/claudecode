import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

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

    const { accountNumber, routingNumber, accountHolderName, bankName } = await request.json()

    if (!accountNumber || !routingNumber || !accountHolderName || !bankName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // In a real app, you would properly encrypt sensitive data
    const encryptedData = Buffer.from(JSON.stringify({
      accountNumber,
      routingNumber,
      timestamp: new Date().toISOString()
    })).toString('base64')

    // Save bank details
    await prisma.bankDetails.upsert({
      where: { userId: payload.userId },
      update: {
        accountNumber: accountNumber.slice(-4), // Only store last 4 digits
        routingNumber,
        accountHolderName,
        bankName,
        encryptedData
      },
      create: {
        userId: payload.userId,
        accountNumber: accountNumber.slice(-4), // Only store last 4 digits
        routingNumber,
        accountHolderName,
        bankName,
        encryptedData
      }
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: payload.userId,
        type: 'ACCOUNT_UPDATE',
        title: 'Bank Details Added',
        message: 'Your bank details have been securely saved. You can now receive payments for your photo sales.',
        channels: '["email"]'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Bank details saved successfully'
    })

  } catch (error) {
    console.error('Bank details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}