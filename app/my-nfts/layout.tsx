import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My NFTs | GRINDSPACE Café",
  description: "View and manage your coffee-themed NFT collection.",
}

export default function MyNFTsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
