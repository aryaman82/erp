import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientOnly } from "@/components/client-only"
import { ErrorBoundary } from "@/components/error-boundary"
import { SystemProvider } from "@/contexts/SystemContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Almed ERP System",
  description: "Complete ERP solution for business management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SystemProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background">
              <ClientOnly fallback={
                <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-blue-600 rounded" />
                      <span className="text-xl font-bold text-gray-900">Almed</span>
                    </div>
                  </div>
                </header>
              }>
                <Navigation />
              </ClientOnly>
              <main className="pt-16">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
            </div>
          </ThemeProvider>
        </SystemProvider>
      </body>
    </html>
  )
}
