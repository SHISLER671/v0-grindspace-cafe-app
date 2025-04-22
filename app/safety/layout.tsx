import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wallet Safety | GRINDSPACE Café",
  description: "Learn how GRINDSPACE Café keeps your wallet and assets safe.",
}

export default function SafetyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
