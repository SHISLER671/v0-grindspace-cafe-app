"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Coffee, ExternalLink, Flame, Sparkles, ArrowRight } from "lucide-react"
import { useAccount } from "wagmi"
import { useTokenBalance } from "@/hooks/use-token-balance"
import { useWriteContract } from "wagmi"
import { parseUnits } from "viem"
import { GRIND_TOKEN_ADDRESS, ERC20_ABI } from "@/lib/contracts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Burn address
const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD"

export default function RewardsPage() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { balance } = useTokenBalance(address)
  const [isBurning, setIsBurning] = useState(false)
  const [burnAmount, setBurnAmount] = useState<string>("")

  // Setup contract write for token transfers
  const { writeContractAsync } = useWriteContract()

  // Format wallet address for display
  const walletAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x123…abcd"

  // Rewards data
  const rewards = [
    {
      title: "Limited Edition NFT",
      description: "Burn 50 $GRIND to mint a limited-edition Bearish Berry skin",
      cost: "50",
      image: "/rich-dark-roast.png",
    },
    {
      title: "VIP Access",
      description: "Burn 100 $GRIND for VIP access to exclusive coffee drops",
      cost: "100",
      image: "/emerald-hills-brew.png",
    },
    {
      title: "Custom Grindspace Avatar",
      description: "Burn 25 $GRIND to unlock a custom avatar for your profile",
      cost: "25",
      image: "/ethiopian-coffee-harvest.png",
    },
  ]

  const handleBurnTokens = async (amount: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to burn tokens",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    if (Number.parseFloat(balance) < Number.parseFloat(amount)) {
      toast({
        title: "Insufficient balance",
        description: `You need at least ${amount} $GRIND to burn`,
        variant: "destructive",
      })
      return
    }

    setIsBurning(true)
    setBurnAmount(amount)

    try {
      // Send tokens to burn address
      const hash = await writeContractAsync({
        address: GRIND_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [BURN_ADDRESS, parseUnits(amount, 18)],
      })

      toast({
        title: "Tokens Burned Successfully! 🔥",
        description: (
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-rainbow-red" />
            <span>You burned {amount} $GRIND tokens</span>
          </div>
        ),
        variant: "default",
      })

      // Simulate reward unlock
      if (rewards.some((r) => r.cost === amount)) {
        setTimeout(() => {
          toast({
            title: "Reward Unlocked! ✨",
            description: "Check your profile for your new reward",
            variant: "default",
          })
        }, 1500)
      }
    } catch (error) {
      console.error("Error burning tokens:", error)
      toast({
        title: "Error burning tokens",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsBurning(false)
      setBurnAmount("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight font-heading">$GRIND Rewards</h1>
      </div>

      {!isConnected ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Please connect your wallet to view and claim rewards.</AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-primary/10 text-primary border-primary/20 mb-6">
          <Coffee className="h-4 w-4" />
          <AlertTitle>Your $GRIND Balance</AlertTitle>
          <AlertDescription>You have {balance} $GRIND tokens available to spend or burn.</AlertDescription>
        </Alert>
      )}

      {/* Ecosystem Links */}
      <Card className="mc-card mb-6">
        <CardHeader>
          <CardTitle className="font-heading">$GRIND Ecosystem</CardTitle>
          <CardDescription className="text-muted-foreground">Explore the $GRIND token ecosystem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <div className="rainbow-divider"></div>

      {/* Burn to Earn Rewards */}
      <h2 className="text-2xl font-bold tracking-tight font-heading mb-4">Burn to Earn Rewards</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => (
          <Card key={reward.title} className="mc-card overflow-hidden">
            <div className="aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={reward.image || "/placeholder.svg"} alt={reward.title} className="h-full w-full object-cover" />
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xl font-heading">{reward.title}</CardTitle>
              <CardDescription className="text-muted-foreground">{reward.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">
                  {Math.min(Number(balance), Number(reward.cost))}/{reward.cost}
                </span>
              </div>
              <Progress value={Math.min((Number(balance) / Number(reward.cost)) * 100, 100)} className="h-2" />
            </CardContent>
            <CardFooter className="p-4 pt-2">
              <Button
                onClick={() => handleBurnTokens(reward.cost)}
                className="w-full gap-2 bg-rainbow-red hover:bg-rainbow-red/90 text-foreground font-medium"
                disabled={isBurning || !isConnected || Number(balance) < Number(reward.cost)}
              >
                {isBurning && burnAmount === reward.cost ? (
                  "Processing..."
                ) : (
                  <>
                    <Flame className="h-4 w-4" />
                    Burn {reward.cost} $GRIND
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" className="mc-button-outline">
          <Link href="/dashboard" className="flex items-center gap-2">
            Back to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
