"use client"

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function UserAuth() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/signin"
          className="text-gray-700 hover:text-gray-900 font-medium"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Get Started Free
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm">
        <div className="font-medium text-gray-900">
          {session.user?.name || session.user?.email}
        </div>
        <div className="text-gray-600">
          {session.user?.tier === 'free' ? (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
              Free Plan ({session.user?.credits} credits left)
            </span>
          ) : session.user?.tier === 'basic' ? (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Basic Plan
            </span>
          ) : (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
              Pro Plan
            </span>
          )}
        </div>
      </div>
      
      {session.user?.tier === 'free' && session.user?.credits !== undefined && session.user.credits <= 3 && (
        <Link
          href="/pricing"
          className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
        >
          Upgrade
        </Link>
      )}
      
      <button
        onClick={() => signOut()}
        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
      >
        Sign Out
      </button>
    </div>
  )
}