"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Coffee, Copy, Gift, Users, Wallet, ExternalLink } from "lucide-react"
import { useAccount } from "wagmi"
import { useTokenBalance } from "@/hooks/use-token-balance"
import { useWriteContract } from "wagmi"
import { parseUnits } from "viem"
import { GRIND_TOKEN_ADDRESS, ERC20_ABI } from "@/lib/contracts"

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCopying, setIsCopying] = useState(false)
  const { address, isConnected } = useAccount()
  const { balance } = useTokenBalance(address)
  const [isReferralClaiming, setIsReferralClaiming] = useState(false)

  // Setup contract write for token transfers
  const { writeContractAsync } = useWriteContract()

  // Format wallet address for display
  const walletAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x123…abcd"

  // Stats
  const stats = [
    {
      title: "$GRIND earned",
      value: isConnected ? balance : "0",
      icon: Coffee,
      color: "text-primary",
    },
    {
      title: "Referred Users",
      value: "7",
      icon: Users,
      color: "text-rainbow-blue",
    },
    {
      title: "Coffee NFTs earned",
      value: "3",
      icon: Gift,
      color: "text-rainbow-yellow",
    },
  ]

  const copyReferralLink = async () => {
    const referralLink = `https://makingcoffee.com/?ref=${address || walletAddress}`

    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(referralLink)
      toast({
        title: "Success!",
        description: "Referral link copied!",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsCopying(false)
    }
  }

  // Simulate claiming rewards for a referral
  const claimReferralReward = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive",
      })
      return
    }

    setIsReferralClaiming(true)

    try {
      // In a real app, this would verify the referral on the backend
      // For demo purposes, we'll simulate minting tokens to the user

      // This is a mock implementation - in production, this would be a server-side
      // verification followed by a token transfer from a treasury wallet
      const hash = await writeContractAsync({
        address: GRIND_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [address, parseUnits("10", 18)],
      })

      toast({
        title: "Rewards Claimed!",
        description: "You've received 10 $GRIND tokens for your referrals!",
      })
    } catch (error) {
      console.error("Error claiming rewards:", error)
      toast({
        title: "Error claiming rewards",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsReferralClaiming(false)
    }
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight font-heading">Referral Dashboard</h1>

      <Card className="mc-card">
        <CardHeader>
          <CardTitle className="font-heading">Your Referral Stats</CardTitle>
          <CardDescription className="text-muted-foreground">
            Invite friends to earn $GRIND and Coffee NFTs
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Wallet Address */}
          <div className="flex items-center gap-2 rounded-lg border border-muted/30 p-4">
            <Wallet className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Connected Wallet</span>
              <span className="font-medium">{walletAddress}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="flex flex-col gap-2 rounded-lg border border-muted/30 p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{stat.title}</span>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="rainbow-divider"></div>

          {/* Referral Link */}
          <div className="space-y-2">
            <Button onClick={copyReferralLink} className="w-full gap-2 mc-button-primary" disabled={isCopying}>
              <Copy className="h-4 w-4" />
              Copy Referral Link
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Share your link to earn rewards when friends join
            </p>
          </div>

          {/* External Referral Link */}
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-foreground font-medium shadow-card">
            <a
              href={`https://makingcoffee.com/?ref=${address || walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Coffee className="h-4 w-4" />☕ Earn $GRIND by Referring Friends
            </a>
          </Button>

          {/* GRINDOGATCHI Link */}
          <Button asChild variant="outline" className="w-full mc-button-outline">
            <a
              href="https://v0-grindogatchi-app-setup-27ya6riam.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <span className="text-lg mr-1">🐹</span> Play GRINDOGATCHI
              <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
            </a>
          </Button>

          {/* Claim Rewards Button */}
          <Button
            onClick={claimReferralReward}
            className="w-full gap-2 bg-rainbow-green hover:bg-rainbow-green/90 text-foreground font-medium"
            disabled={isReferralClaiming || !isConnected}
          >
            <Gift className="h-4 w-4" />
            {isReferralClaiming ? "Processing..." : "Claim Referral Rewards"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Claim 10 $GRIND tokens for each successful referral
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => router.push("/tip")} variant="outline" className="w-full gap-2 mc-button-outline">
            <Gift className="h-4 w-4" />
            Tip a Farmer
          </Button>
          <Button onClick={() => router.push("/shop")} variant="outline" className="w-full gap-2 mc-button-outline">
            <Coffee className="h-4 w-4" />
            Visit Shop
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
