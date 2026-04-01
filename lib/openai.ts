import OpenAI from 'openai'

// 配置OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
})

// 平台特定的提示词模板
const PLATFORM_PROMPTS = {
  twitter: `你是一个社交媒体专家。请将以下内容转化为适合Twitter的推文：
要求：
1. 不超过280字符（包括空格和标点）
2. 使用1-3个相关话题标签
3. 语气吸引人、有互动性
4. 可以添加表情符号增加吸引力
5. 如果有数据或关键点，用简洁方式突出

原文：{content}

请输出优化后的推文：`,

  linkedin: `你是一个职场内容专家。请将以下内容转化为适合LinkedIn的专业帖子：
要求：
1. 专业但不过于正式的语气
2. 可以适当添加个人见解或行业观察
3. 使用相关的话题标签（3-5个）
4. 结构清晰：引言、主体、结论
5. 鼓励互动（提问或邀请评论）

原文：{content}

请输出优化后的LinkedIn帖子：`,

  blog: `你是一个内容策略专家。请将以下内容扩展为适合博客的文章：
要求：
1. 结构完整：标题、引言、主体、结论
2. 添加小标题提高可读性
3. 可以补充相关数据、案例或建议
4. 语气专业但有亲和力
5. 适合SEO优化（自然包含关键词）

原文：{content}

请输出优化后的博客文章：`
}

// 生成平台特定内容
export async function generatePlatformContent(content: string, platform: 'twitter' | 'linkedin' | 'blog') {
  try {
    const prompt = PLATFORM_PROMPTS[platform].replace('{content}', content)
    
    const response = await openai.chat.completions.create({
      model: 'gpt-5', // 使用Boss提供的GPT-5
      messages: [
        {
          role: 'system',
          content: '你是一个专业的内容优化专家，擅长为不同平台定制内容。请生成高质量、实用、符合平台特性的内容。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: platform === 'twitter' ? 150 : platform === 'linkedin' ? 500 : 1000,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('内容生成失败，请稍后重试')
  }
}

// 批量生成多个平台内容
export async function generateMultiplePlatforms(content: string, platforms: Array<'twitter' | 'linkedin' | 'blog'>) {
  const results: Record<string, string> = {}
  
  // 并行生成（限制并发数）
  const promises = platforms.map(async (platform) => {
    try {
      const generated = await generatePlatformContent(content, platform)
      results[platform] = generated
    } catch (error) {
      results[platform] = `生成失败：${error instanceof Error ? error.message : '未知错误'}`
    }
  })

  await Promise.all(promises)
  return results
}

// 估算token成本（用于使用限制）
export function estimateTokenCost(content: string): number {
  // 简单估算：1个中文字符≈2个token，1个英文字符≈0.75个token
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishChars = content.length - chineseChars
  return Math.ceil(chineseChars * 2 + englishChars * 0.75)
}

// 检查内容安全性
export async function checkContentSafety(content: string): Promise<boolean> {
  try {
    const response = await openai.moderations.create({
      input: content,
    })
    
    return !response.results[0].flagged
  } catch (error) {
    console.warn('内容安全检查失败:', error)
    return true // 失败时默认通过
  }
}