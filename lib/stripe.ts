import Stripe from 'stripe'

// 重要: Stripe 密钥必须通过环境变量 STRIPE_SECRET_KEY 提供
// - 生产环境: 在 Railway/Vercel 等平台配置 STRIPE_SECRET_KEY
// - 开发环境: 在 .env.local 设置 STRIPE_SECRET_KEY

// 创建 Stripe 客户端（构建期会被 Tree-shaking，但确保导入有效）
let stripeInstance: Stripe | null = null

export function getStripe() {
  if (!stripeInstance) {
    const stripeKey = process.env.STRIPE_SECRET_KEY || ''
    
    // 构建时如果没有密钥，返回模拟对象避免构建失败
    if (!stripeKey && process.env.NODE_ENV === 'production') {
      console.warn('STRIPE_SECRET_KEY not set in production')
      // 返回一个模拟的stripe对象，避免构建失败
      stripeInstance = {
        checkout: {
          sessions: {
            create: async () => ({ id: 'mock_session_id', url: 'https://stripe.com/mock' })
          }
        },
        products: {
          list: async () => ({ data: [] }),
          create: async () => ({ id: 'mock_product_id' })
        },
        prices: {
          create: async () => ({ id: 'mock_price_id' })
        },
        webhooks: {
          constructEvent: () => ({ type: 'mock', data: {} })
        }
      } as any
    } else {
      stripeInstance = new Stripe(stripeKey, {
        apiVersion: '2023-10-16',
        appInfo: {
          name: 'AI Content Distributor',
          version: '1.0.0'
        }
      })
    }
  }
  
  return stripeInstance!
}

export const stripe = getStripe()

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
    const stripe = getStripe()
    
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
  const stripe = getStripe()
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
  const stripe = getStripe()
  return stripe.webhooks.constructEvent(payload, signature, secret)
}