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
  const { login, isLoggingIn } = useLoginWithAbstract()
  const { isConnected } = useAccount() || { isConnected: false }

  // Store connection state when user connects
  const handleConnect = async () => {
    if (!isConnected && login) {
      try {
        await login()
        // Store connection state in localStorage
        localStorage.setItem("agw-connection", "true")
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    }
  }

  return (
    <Button
      onClick={handleConnect}
      className={cn("gap-2 mc-button-primary", className)}
      disabled={isConnected || isLoggingIn}
    >
      <Wallet className="h-4 w-4" />
      {isLoggingIn ? "Connecting..." : isConnected ? "Wallet Connected" : "Connect Wallet"}
    </Button>
  )
}
