import { NextRequest, NextResponse } from 'next/server'
import { stripe, constructEvent } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  try {
    // 验证Webhook签名
    const event = constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
    )

    // 处理不同的事件类型
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        
        // 更新用户套餐
        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: {
            tier: session.metadata.tier,
            credits: session.metadata.tier === 'basic' ? 1000 : 10000
          }
        })

        // 记录支付
        await prisma.payment.create({
          data: {
            userId: session.metadata.userId,
            stripeId: session.id,
            amount: session.amount_total || 0,
            currency: session.currency || 'usd',
            status: 'succeeded',
            tier: session.metadata.tier,
            period: 'monthly'
          }
        })

        console.log(`Payment succeeded for user ${session.metadata.userId}, tier: ${session.metadata.tier}`)
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        // 这里可以处理订阅更新或取消
        console.log(`Subscription ${event.type}:`, subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        console.log(`Payment failed for invoice:`, invoice.id)
        // 可以在这里发送支付失败通知
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}