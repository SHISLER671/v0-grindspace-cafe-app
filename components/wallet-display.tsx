"use client"

import { useEffect } from "react"
import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, Coffee, InfoIcon } from "lucide-react"
import { ConnectWalletButton } from "./connect-wallet-button"
import { useTokenBalance } from "@/hooks/use-token-balance"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WalletDisplay() {
  const { logout, login, isLoggingIn } = useLoginWithAbstract()
  const { address, isConnected } = useAccount()
  const { balance, isLoading } = useTokenBalance(address)

  // Attempt to reconnect on component mount if we have a stored connection
  useEffect(() => {
    if (typeof window === "undefined") return

    const attemptReconnect = async () => {
      const hasStoredConnection = localStorage.getItem("agw-connection")
      if (hasStoredConnection && !isConnected && !isLoggingIn && login) {
        try {
          await login()
        } catch (error) {
          console.error("Failed to auto-reconnect wallet:", error)
          // Clear stored connection if reconnect fails
          localStorage.removeItem("agw-connection")
        }
      }
    }

    attemptReconnect()
  }, [isConnected, isLoggingIn, login])

  // Format address to show first 6 and last 4 characters
  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Store connection state when connected
  useEffect(() => {
    if (typeof window === "undefined") return

    if (isConnected && address) {
      localStorage.setItem("agw-connection", "true")
    }
  }, [isConnected, address])

  // Handle logout - clear stored connection
  const handleLogout = () => {
    if (typeof window === "undefined") return

    localStorage.removeItem("agw-connection")
    if (logout) logout()
  }

  if (!isConnected) {
    return <ConnectWalletButton />
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden rounded-full bg-muted px-3 py-1 text-sm md:flex items-center gap-3">
        <span className="flex items-center gap-2">
          <Wallet className="h-3.5 w-3.5 text-primary" />
          {formatAddress(address || "")}
        </span>
        <div className="h-3 w-[1px] bg-muted-foreground/30"></div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-help">
                <Coffee className="h-3.5 w-3.5 text-primary" />
                {isLoading ? <Skeleton className="h-4 w-12" /> : <span className="font-medium">{balance} $GRIND</span>}
                <InfoIcon className="h-3 w-3 text-muted-foreground/70" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Earn $GRIND through referrals or coffee purchases</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs">
        Disconnect
      </Button>
    </div>
  )
}
