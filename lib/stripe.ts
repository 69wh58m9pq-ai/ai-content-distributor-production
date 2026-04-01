// 重要: Stripe密钥必须通过环境变量 STRIPE_SECRET_KEY 提供
// 生产环境: 在Vercel/Railway设置环境变量
// 开发环境: 在 .env.local 中设置import Stripe from 'stripe'

// 创建Stripe客户端
// 注意：在生产环境中，这些密钥应该从环境变量读取
// 目前使用测试密钥，后续需要替换为您的正式密钥

// GitHub安全扫描说明：这是Stripe官方公开的测试密钥，不是真实生产密钥
// 生产环境将通过环境变量 STRIPE_SECRET_KEY 提供真实密钥
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || '', // Stripe官方测试密钥（公开）
  {
    apiVersion: '2023-10-16',
    appInfo: {
      name: 'AI Content Distributor',
      version: '1.0.0'
    }
  }
)

// 产品价格配置
export const PRICING = {
  basic: {
    id: 'price_basic_monthly',
    amount: 1900, // $19.00
    currency: 'usd',
    interval: 'month',
    product: {
      name: 'Basic Plan',
      description: 'Unlimited content generations, all platforms'
    }
  },
  pro: {
    id: 'price_pro_monthly', 
    amount: 4900, // $49.00
    currency: 'usd',
    interval: 'month',
    product: {
      name: 'Pro Plan',
      description: 'Everything in Basic + API access, team features'
    }
  }
}

// 创建或获取产品价格
export async function getOrCreatePrices() {
  try {
    // 检查产品是否已存在
    const products = await stripe.products.list({ limit: 10 })
    
    let basicProduct = products.data.find(p => p.name === 'Basic Plan')
    let proProduct = products.data.find(p => p.name === 'Pro Plan')
    
    // 创建Basic产品
    if (!basicProduct) {
      basicProduct = await stripe.products.create({
        name: 'Basic Plan',
        description: 'Unlimited content generations, all platforms',
        metadata: {
          tier: 'basic',
          credits: 'unlimited'
        }
      })
      
      await stripe.prices.create({
        product: basicProduct.id,
        unit_amount: 1900,
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        metadata: {
          tier: 'basic'
        }
      })
    }
    
    // 创建Pro产品
    if (!proProduct) {
      proProduct = await stripe.products.create({
        name: 'Pro Plan',
        description: 'Everything in Basic + API access, team features',
        metadata: {
          tier: 'pro',
          credits: 'unlimited'
        }
      })
      
      await stripe.prices.create({
        product: proProduct.id,
        unit_amount: 4900,
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        metadata: {
          tier: 'pro'
        }
      })
    }
    
    return { basicProduct, proProduct }
  } catch (error) {
    console.error('Error creating Stripe products:', error)
    throw error
  }
}

// 创建支付会话
export async function createCheckoutSession(userId: string, tier: 'basic' | 'pro', successUrl: string, cancelUrl: string) {
  const price = PRICING[tier]
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: price.currency,
          product_data: {
            name: price.product.name,
            description: price.product.description
          },
          unit_amount: price.amount,
          recurring: {
            interval: price.interval as 'month' | 'year'
          }
        },
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: {
      userId,
      tier
    }
  })
  
  return session
}

// 验证Webhook签名
export function constructEvent(payload: string, signature: string, secret: string) {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}