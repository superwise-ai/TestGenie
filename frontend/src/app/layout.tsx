import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'TestGenie - AI-Powered Test Automation Platform',
  description: 'Transform your testing with AI agents that create, run, analyze, maintain, and optimize automated tests. Join thousands of teams already using our platform.',
  keywords: 'test automation, AI testing, automated testing, quality assurance, test management, software testing',
  authors: [{ name: 'TestGenie Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'TestGenie - AI-Powered Test Automation Platform',
    description: 'Transform your testing with AI agents that create, run, analyze, maintain, and optimize automated tests.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TestGenie - AI-Powered Test Automation Platform',
    description: 'Transform your testing with AI agents that create, run, analyze, maintain, and optimize automated tests.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  )
}
