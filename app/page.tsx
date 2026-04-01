import ContentDistributor from '@/components/ContentDistributor'
import UserAuth from '@/components/UserAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                AI Content Distributor
              </h1>
              <p className="text-lg text-gray-600">
                Transform one piece of content into optimized versions for multiple platforms.
                Save hours of manual work with AI-powered content adaptation.
              </p>
            </div>
            <UserAuth />
          </div>
          
          {!session && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800">
                <span className="font-semibold">Free account includes 10 content generations.</span>{' '}
                No credit card required to start.
              </p>
            </div>
          )}
          
          {session?.user?.tier === 'free' && session.user.credits !== undefined && session.user.credits <= 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800">
                <span className="font-semibold">Only {session.user.credits} credits left!</span>{' '}
                <a href="/pricing" className="text-blue-600 hover:text-blue-800 font-medium">
                  Upgrade to Basic Plan for unlimited generations →
                </a>
              </p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContentDistributor />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ How It Works</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">1</span>
                  </div>
                  <span className="text-gray-700">Paste your original content</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">2</span>
                  </div>
                  <span className="text-gray-700">Select target platforms</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">3</span>
                  </div>
                  <span className="text-gray-700">AI generates optimized versions</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">4</span>
                  </div>
                  <span className="text-gray-700">Copy & publish instantly</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Platform Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Twitter</span>
                    <span className="text-gray-900 font-medium">280 chars</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">LinkedIn</span>
                    <span className="text-gray-900 font-medium">1300 chars</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Blog Post</span>
                    <span className="text-gray-900 font-medium">Unlimited</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-3">🚀 Coming Soon</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-white mr-2"></div>
                  <span>Instagram & TikTok captions</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-white mr-2"></div>
                  <span>Auto-publishing to platforms</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-white mr-2"></div>
                  <span>Image generation for posts</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-white mr-2"></div>
                  <span>Multi-language support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}