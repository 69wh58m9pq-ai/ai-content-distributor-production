import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateMultiplePlatforms, estimateTokenCost, checkContentSafety } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

// 简单的内存缓存（生产环境应使用Redis）
const cache = new Map<string, { content: string; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1小时缓存

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

    const { content, platforms } = await request.json()

    // 输入验证
    if (!content || !platforms || !Array.isArray(platforms)) {
      return NextResponse.json(
        { error: 'Missing required fields: content and platforms' },
        { status: 400 }
      )
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Content too long. Please limit to 5000 characters.' },
        { status: 400 }
      )
    }

    // 检查用户剩余次数
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 免费用户检查剩余次数
    if (user.tier === 'free' && user.credits <= 0) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your plan.' },
        { status: 402 }
      )
    }

    // 检查内容安全性
    const isSafe = await checkContentSafety(content)
    if (!isSafe) {
      return NextResponse.json(
        { error: 'Content contains unsafe elements. Please modify and try again.' },
        { status: 400 }
      )
    }

    // 检查缓存
    const cacheKey = `${content}-${platforms.sort().join(',')}`
    const cached = cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      // 记录使用（即使从缓存获取）
      if (user.tier === 'free') {
        await prisma.user.update({
          where: { id: user.id },
          data: { credits: { decrement: 1 } }
        })
      }

      await prisma.usage.create({
        data: {
          userId: user.id,
          content: content.substring(0, 500), // 只存储前500字符
          platform: platforms.join(','),
          tokens: estimateTokenCost(content) * platforms.length,
          cost: 0.003 * platforms.length // 估算成本
        }
      })

      return NextResponse.json({
        success: true,
        platforms: JSON.parse(cached.content),
        cached: true,
        timestamp: new Date().toISOString(),
        estimatedTokens: estimateTokenCost(content) * platforms.length,
        remainingCredits: user.tier === 'free' ? user.credits - 1 : 'unlimited'
      })
    }

    // 调用OpenAI API生成内容
    const responses = await generateMultiplePlatforms(content, platforms as any)

    // 更新缓存
    cache.set(cacheKey, {
      content: JSON.stringify(responses),
      timestamp: Date.now()
    })

    // 清理过期缓存
    for (const [key, value] of cache.entries()) {
      if (Date.now() - value.timestamp > CACHE_TTL) {
        cache.delete(key)
      }
    }

    // 记录使用和扣减次数
    if (user.tier === 'free') {
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } }
      })
    }

    await prisma.usage.create({
      data: {
        userId: user.id,
        content: content.substring(0, 500),
        platform: platforms.join(','),
        tokens: estimateTokenCost(content) * platforms.length,
        cost: 0.003 * platforms.length
      }
    })

    return NextResponse.json({
      success: true,
      platforms: responses,
      cached: false,
      timestamp: new Date().toISOString(),
      estimatedTokens: estimateTokenCost(content) * platforms.length,
      remainingCredits: user.tier === 'free' ? user.credits - 1 : 'unlimited',
      note: 'Powered by OpenAI GPT-5'
    })

  } catch (error: any) {
    console.error('API Error:', error)
    
    // 提供更友好的错误信息
    let errorMessage = 'Content generation failed. Please try again.'
    let statusCode = 500
    
    if (error.message?.includes('API key')) {
      errorMessage = 'OpenAI API configuration error'
      statusCode = 503
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'Request too frequent. Please try again later.'
      statusCode = 429
    } else if (error.message?.includes('No credits')) {
      errorMessage = error.message
      statusCode = 402
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    )
  }
}

// 添加GET端点用于健康检查
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'AI Content Generator API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    cacheSize: cache.size
  })
}