"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Coffee, Copy, Gift, Users, Wallet } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCopying, setIsCopying] = useState(false)

  // Placeholder wallet address
  const walletAddress = "0x123…abcd"

  // Stats
  const stats = [
    {
      title: "$GRIND earned",
      value: "420.69",
      icon: Coffee,
      color: "text-primary",
    },
    {
      title: "Referred Users",
      value: "7",
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Coffee NFTs earned",
      value: "3",
      icon: Gift,
      color: "text-amber-400",
    },
  ]

  const copyReferralLink = async () => {
    const referralLink = `https://makingcoffee.com/?ref=${walletAddress}`

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

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Referral Dashboard</h1>

      <Card className="border-muted/30 bg-background/95 backdrop-blur">
        <CardHeader>
          <CardTitle>Your Referral Stats</CardTitle>
          <CardDescription>Invite friends to earn $GRIND and Coffee NFTs</CardDescription>
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
              <div key={stat.title} className="flex flex-col gap-2 rounded-lg border border-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{stat.title}</span>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Referral Link */}
          <div className="space-y-2">
            <Button onClick={copyReferralLink} className="w-full gap-2" disabled={isCopying}>
              <Copy className="h-4 w-4" />
              Copy Referral Link
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Share your link to earn rewards when friends join
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={() => router.push("/tip")} variant="outline" className="w-full gap-2">
            <Gift className="h-4 w-4" />
            Tip a Farmer
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
