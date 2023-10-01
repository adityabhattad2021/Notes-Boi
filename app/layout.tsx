import { ClerkProvider } from "@clerk/nextjs"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from "@/components/Provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notes-Boi',
  description: 'Just a weekend project.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Provider>
          <body className={inter.className}>
            {children}
            <Toaster/>
          </body>
        </Provider>
      </html>
    </ClerkProvider>
  )
}
