"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2, Users, Gift } from "lucide-react"
import { useReferral } from "@/hooks/use-referral"
import { useAccount } from "wagmi"
import { Badge } from "@/components/ui/badge"

export function ReferralShareCard() {
  const { address } = useAccount()
  const { referralLink, isCopying, copyReferralLink, referralEarnings } = useReferral(address)

  // Share via native share API if available
  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Grindspace Café",
          text: "Earn $GRIND tokens and enjoy exclusive coffee experiences!",
          url: referralLink,
        })
      } catch (err) {
        // User likely canceled the share operation
        console.log("Share canceled or failed:", err)
      }
    } else {
      // Fallback to copy if share API not available
      copyReferralLink()
    }
  }

  return (
    <Card className="mc-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-heading">
            <Users className="h-5 w-5 text-primary" />
            Share Your Referral Link
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Gift className="h-3 w-3 mr-1" />
            {referralEarnings} $GRIND earned
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground mt-1">☕ Invite a friend, earn $GRIND!</CardDescription>
        <p className="text-sm text-muted-foreground mt-2">
          Share your custom link below — when a friend joins and tips, you earn 10 $GRIND automatically.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={referralLink}
            readOnly
            className="bg-muted/20 border-muted/30 font-mono text-sm"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button
            onClick={copyReferralLink}
            variant="outline"
            size="icon"
            className="flex-shrink-0 border-primary/20 hover:bg-primary/10 hover:border-primary/50 relative"
            disabled={isCopying}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy referral link</span>
          </Button>
        </div>

        <Button
          onClick={shareReferralLink}
          className="w-full gap-2 bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-600 hover:to-blue-600 text-white font-medium"
        >
          <Share2 className="h-4 w-4" />✨ Share Referral Link ✨
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Earn {10} $GRIND tokens for each friend who joins and completes an action
        </p>

        <div className="mt-4 pt-4 border-t border-muted/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total referrals:</span>
            <span className="font-medium">{Math.floor(referralEarnings / 10)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
