import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Burn Offerings | GRINDSPACE Café",
  description: "Make a worthy sacrifice of $GRIND tokens to Beanjahmon, the mystical coffee guru.",
}

export default function BurnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
