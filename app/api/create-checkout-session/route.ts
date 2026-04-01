import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { tier } = await request.json()
    
    if (!tier || !['basic', 'pro'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier selection' },
        { status: 400 }
      )
    }

    // 检查用户是否已有该套餐
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (user?.tier === tier) {
      return NextResponse.json(
        { error: `You are already on the ${tier} plan` },
        { status: 400 }
      )
    }

    // 创建支付会话
    const checkoutSession = await createCheckoutSession(
      session.user.id,
      tier as 'basic' | 'pro',
      `${process.env.NEXTAUTH_URL}/payment/success`,
      `${process.env.NEXTAUTH_URL}/payment/cancel`
    )

    return NextResponse.json({
      url: checkoutSession.url
    })

  } catch (error: any) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}