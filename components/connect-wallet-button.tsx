"use client"

import { Button } from "@/components/ui/button"
import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
import { useAccount } from "wagmi"
import { Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConnectWalletButtonProps {
  className?: string
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  const { login } = useLoginWithAbstract()
  const { isConnected } = useAccount() || { isConnected: false }

  return (
    <Button onClick={() => !isConnected && login && login()} className={cn("gap-2", className)} disabled={isConnected}>
      <Wallet className="h-4 w-4" />
      {isConnected ? "Wallet Connected" : "Connect Wallet"}
    </Button>
  )
}
