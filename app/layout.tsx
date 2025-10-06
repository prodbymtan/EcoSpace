import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoSpace - AI-based Earth Air Tracker',
  description: 'NASA Space Apps Challenge 2025: Learn, Launch, Lead - Real-time air quality monitoring using NASA Earth observation data',
  keywords: 'NASA, Space Apps, Air Quality, Earth Observation, Climate, AI, Machine Learning',
  authors: [{ name: 'NASA Space Apps Challenge Team' }],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'EcoSpace - AI-based Earth Air Tracker',
    description: 'Real-time air quality monitoring using NASA Earth observation data',
    type: 'website',
    images: [
      {
        url: '/ecospace-logo.png',
        width: 120,
        height: 120,
        alt: 'EcoSpace Logo',
      },
    ],
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          {children}
        </div>
      </body>
    </html>
  )
}
