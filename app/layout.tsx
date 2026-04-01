import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Content Distributor - Transform Content for Multiple Platforms',
  description: 'Generate optimized content for Twitter, LinkedIn, and blogs using GPT-5. Save hours of manual work.',
  keywords: ['AI content', 'content distribution', 'social media', 'GPT-5', 'content optimization'],
  authors: [{ name: 'AI Content Distributor' }],
  openGraph: {
    title: 'AI Content Distributor',
    description: 'Transform one piece of content into optimized versions for multiple platforms',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}