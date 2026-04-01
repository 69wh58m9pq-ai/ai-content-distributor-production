"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, Sparkles, Zap, Infinity as Infinite, Shield, Users, Globe } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out the platform',
    features: [
      '10 content generations per month',
      'All platform support (Twitter, LinkedIn, Blog)',
      'GPT-5 powered optimization',
      'Basic content safety checks',
      'Community support'
    ],
    cta: 'Get Started Free',
    href: '/auth/signup',
    popular: false,
    color: 'gray'
  },
  {
    name: 'Basic',
    price: '$19',
    period: '/month',
    description: 'For serious content creators',
    features: [
      'Unlimited content generations',
      'All platform support',
      'GPT-5 powered optimization',
      'Advanced content safety',
      'Priority support',
      'Usage analytics dashboard',
      'Export to multiple formats'
    ],
    cta: 'Upgrade to Basic',
    href: '#', // Will be replaced with checkout
    popular: true,
    color: 'blue'
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For teams and agencies',
    features: [
      'Everything in Basic',
      'API access',
      'Team collaboration (3 users)',
      'Custom platform templates',
      'White-label options',
      'Dedicated account manager',
      'SLA guarantee'
    ],
    cta: 'Upgrade to Pro',
    href: '#', // Will be replaced with checkout
    popular: false,
    color: 'purple'
  }
]

export default function PricingPage() {
  const { data: session } = useSession()
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async (plan: string) => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: plan })
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your content creation needs. All plans include GPT-5 powered optimization.
          </p>
        </div>

        {/* Current Plan Banner */}
        {session && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Your Current Plan</h3>
                  <p className="text-blue-700 mt-1">
                    {session.user?.tier === 'free' ? (
                      <>Free Plan ({session.user?.credits} credits remaining)</>
                    ) : session.user?.tier === 'basic' ? (
                      <>Basic Plan (Unlimited generations)</>
                    ) : (
                      <>Pro Plan (Team features included)</>
                    )}
                  </p>
                </div>
                {session.user?.tier === 'free' && (
                  <div className="text-sm text-blue-700">
                    <Sparkles className="h-5 w-5 inline mr-1" />
                    Upgrade for unlimited access
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 ${
                plan.popular
                  ? 'border-blue-500 shadow-xl transform scale-105'
                  : 'border-gray-200'
              } bg-white p-8 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="ml-2 text-xl text-gray-600">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className={`h-5 w-5 ${
                        plan.color === 'gray' ? 'text-gray-400' :
                        plan.color === 'blue' ? 'text-blue-500' :
                        'text-purple-500'
                      } mr-3 flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                {plan.name === 'Free' ? (
                  <Link
                    href={plan.href}
                    className={`w-full block text-center py-3 px-4 rounded-lg font-medium ${
                      session ? 'bg-gray-100 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                    } transition`}
                  >
                    {session && session.user?.tier === 'free' ? 'Current Plan' : plan.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.name.toLowerCase())}
                    disabled={isProcessing || (session?.user?.tier === plan.name.toLowerCase())}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing ? 'Processing...' : 
                     session?.user?.tier === plan.name.toLowerCase() ? 'Current Plan' : plan.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens when I run out of free credits?
              </h3>
              <p className="text-gray-600">
                You can upgrade to Basic plan for unlimited generations, or wait until next month when your credits reset. Free users get 10 credits refreshed monthly.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial for paid plans?
              </h3>
              <p className="text-gray-600">
                The Free plan itself is our trial! It includes 10 generations so you can fully test the platform before upgrading.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to transform your content workflow?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of content creators who save hours every week with AI Content Distributor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Free Today
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}