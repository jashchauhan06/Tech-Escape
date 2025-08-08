import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const firaCode = Fira_Code({ 
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tech Escape - | IEEE SIT | Flag: IEEE{hidden_flag_found}',
  description: 'Embark on your digital treasure hunt adventure with IEEE SIT',
  keywords: 'IEEE, SIT, Tech Escape, Digital Treasure Hunt, Challenge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
