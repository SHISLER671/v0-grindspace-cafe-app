import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Coffee Bean Reading | GRINDSPACE Café",
  description: "Discover your future through the ancient art of coffee bean reading.",
}

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
