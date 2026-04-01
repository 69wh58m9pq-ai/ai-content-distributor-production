'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Copy, Sparkles, Twitter, Linkedin, FileText, Loader2, Lock } from 'lucide-react'
import Link from 'next/link'

type Platform = 'twitter' | 'linkedin' | 'blog'

interface PlatformConfig {
  id: Platform
  name: string
  icon: React.ReactNode
  description: string
  maxLength: number
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter className="h-5 w-5" />,
    description: 'Short, engaging posts with hashtags',
    maxLength: 280
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="h-5 w-5" />,
    description: 'Professional tone with insights',
    maxLength: 1300
  },
  {
    id: 'blog',
    name: 'Blog Post',
    icon: <FileText className="h-5 w-5" />,
    description: 'Detailed, structured content',
    maxLength: 5000
  }
]

export default function ContentDistributor() {
  const { data: session, status } = useSession()
  const [originalContent, setOriginalContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter', 'linkedin'])
  const [generatedContent, setGeneratedContent] = useState<Record<Platform, string>>({
    twitter: '',
    linkedin: '',
    blog: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedPlatform, setCopiedPlatform] = useState<Platform | null>(null)
  const [error, setError] = useState('')

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  const handleCopy = async (text: string, platform: Platform) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPlatform(platform)
      setTimeout(() => setCopiedPlatform(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleGenerate = async () => {
    // 检查用户登录
    if (!session) {
      setError('Please sign in to generate content')
      return
    }

    // 检查免费用户剩余次数
    if (session.user?.tier === 'free' && session.user?.credits !== undefined && session.user.credits <= 0) {
      setError('No credits remaining. Please upgrade your plan.')
      return
    }

    // 检查内容长度
    if (!originalContent.trim()) {
      setError('Please enter some content to generate')
      return
    }

    if (originalContent.length > 5000) {
      setError('Content is too long. Please limit to 5000 characters.')
      return
    }

    setError('')
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: originalContent,
          platforms: selectedPlatforms,
          userTier: session.user?.tier || 'free'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const data = await response.json()
      
      // 更新生成的内容
      const newContent = { ...generatedContent }
      Object.keys(data.platforms).forEach(platform => {
        newContent[platform as Platform] = data.platforms[platform]
      })
      setGeneratedContent(newContent)

      // 如果生成成功，页面会自动刷新显示新的剩余次数
      // 因为NextAuth session会自动更新

    } catch (err: any) {
      setError(err.message || 'Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const wordCount = originalContent.trim().split(/\s+/).filter(word => word.length > 0).length
  const charCount = originalContent.length

  // 检查是否需要显示付费墙
  const showUpgradePrompt = session?.user?.tier === 'free' && 
    session.user?.credits !== undefined && 
    session.user.credits <= 3

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Distributor</h2>
        {session && (
          <div className="text-sm text-gray-600">
            {session.user?.tier === 'free' ? (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                {session.user?.credits} credits remaining
              </span>
            ) : (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {session.user?.tier === 'basic' ? 'Basic Plan' : 'Pro Plan'} - Unlimited
              </span>
            )}
          </div>
        )}
      </div>

      {showUpgradePrompt && (
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-yellow-800">Upgrade for Unlimited Access</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Only {session.user?.credits} credits left. Upgrade to Basic Plan for unlimited generations.
              </p>
            </div>
            <Link
              href="/pricing"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Original Content Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Original Content
        </label>
        <textarea
          value={originalContent}
          onChange={(e) => setOriginalContent(e.target.value)}
          placeholder="Paste your original content here..."
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          disabled={!session}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Platforms
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              disabled={!session}
              className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                selectedPlatforms.includes(platform.id) ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {platform.icon}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">{platform.name}</div>
                <div className="text-xs text-gray-500">{platform.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="mb-8">
        {!session ? (
          <div className="text-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Sign Up Free to Generate Content
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              Free account includes 10 content generations
            </p>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedPlatforms.length || !originalContent.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Content ({selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''})
              </>
            )}
          </button>
        )}
      </div>

      {/* Generated Content */}
      {Object.values(generatedContent).some(content => content) && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
          
          {PLATFORMS.map((platform) => (
            generatedContent[platform.id] && (
              <div key={platform.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gray-100 mr-3">
                      {platform.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{platform.name}</div>
                      <div className="text-xs text-gray-500">
                        {generatedContent[platform.id].length} characters
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(generatedContent[platform.id], platform.id)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedPlatform === platform.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
                  {generatedContent[platform.id]}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}