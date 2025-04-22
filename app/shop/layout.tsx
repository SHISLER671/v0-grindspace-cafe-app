import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Exclusive Shop | GRINDSPACE Café",
  description: "Spend your $GRIND tokens on exclusive coffee experiences and products.",
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
