import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Caregiver & Family Platform',
  description: 'Trusted Care for the Ones Who Matter Most',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
