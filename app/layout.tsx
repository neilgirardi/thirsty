import 'styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thirsty - Find Your Perfect Drink',
  description: 'Search and discover cocktail recipes',
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
