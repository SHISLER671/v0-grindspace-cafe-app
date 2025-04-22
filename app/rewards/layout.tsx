import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rewards | GRINDSPACE Café",
  description: "Earn and burn $GRIND tokens for exclusive rewards in the GRINDSPACE ecosystem.",
}

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
