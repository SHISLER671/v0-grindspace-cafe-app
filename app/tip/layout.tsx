import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tip Farmers | GRINDSPACE Café",
  description: "Support coffee farmers directly with $GRIND tokens or fiat currency.",
}

export default function TipLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
