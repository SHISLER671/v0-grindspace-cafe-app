import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leaderboard | GRINDSPACE Café",
  description: "See the top tippers and referrers in the GRINDSPACE community.",
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
