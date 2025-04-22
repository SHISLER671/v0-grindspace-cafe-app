import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BearishAF Barista | GRINDSPACE Café",
  description: "Chat with Beanjahmon, your irie uncle who knows almost everything about coffee.",
}

export default function BaristaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
