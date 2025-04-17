"use client"

import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { ConnectWalletButton } from "./connect-wallet-button"

export function WalletDisplay() {
  const { logout } = useLoginWithAbstract()
  const { address, isConnected } = useAccount()

  // Format address to show first 6 and last 4 characters
  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return <ConnectWalletButton />
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden rounded-full bg-muted px-3 py-1 text-sm md:block">
        <span className="flex items-center gap-2">
          <Wallet className="h-3.5 w-3.5 text-primary" />
          {formatAddress(address || "")}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => logout && logout()} className="text-xs">
        Disconnect
      </Button>
    </div>
  )
}
