import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model = 'gpt-4' } = body
    
    // 模拟AI响应
    const mockResponse = {
      id: 'chatcmpl-local-mock-123456',
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `这是模拟的AI响应。您输入了: "${messages[messages.length - 1]?.content || '无内容'}"\n\n我可以为以下平台生成内容:\n1. Twitter/X: 简短吸引人的推文\n2. LinkedIn: 专业文章\n3. Instagram: 视觉描述\n4. 公众号: 深度文章\n\n请告诉我您想为哪个平台生成内容？`
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 50,
        completion_tokens: 100,
        total_tokens: 150
      }
    }
    
    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Mock OpenAI error:', error)
    return NextResponse.json(
      { error: '模拟API错误' },
      { status: 500 }
    )
  }
}