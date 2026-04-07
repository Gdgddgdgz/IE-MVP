import './globals.css'
import type { Metadata } from 'next'
import { ToastProvider } from '@/components/ToastProvider'

export const metadata: Metadata = {
  title: 'DGCare | Editorial Healthcare Excellence',
  description: 'Trusted Care for the Ones Who Matter Most',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth relative">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="selection:bg-primary-fixed selection:text-on-primary-fixed bg-background text-on-background">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
