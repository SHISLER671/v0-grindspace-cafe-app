import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AGWProvider } from "@/components/providers/agw-provider"
import { Toaster } from "@/components/ui/toaster"

// Load fonts
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "GRINDSPACE Café | Web3 Coffee Experience",
  description:
    "A cozy digital café for web3 enthusiasts. Earn $GRIND tokens, tip farmers, and enjoy exclusive coffee experiences.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${workSans.variable} ${inter.variable} min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AGWProvider>{children}</AGWProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
