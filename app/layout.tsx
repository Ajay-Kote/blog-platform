import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import ReduxProvider from "@/components/ReduxProvider"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "MERN Blog App",
  description: "A full-stack blog application built with Next.js, MongoDB, and Redux",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ReduxProvider>{children}</ReduxProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
