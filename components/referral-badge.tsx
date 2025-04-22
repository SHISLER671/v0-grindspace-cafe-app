"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useReferral } from "@/hooks/use-referral"
import { useAccount } from "wagmi"

export function ReferralBadge() {
  const { address } = useAccount()
  const { referrer, hasRewarded } = useReferral(address)
  const [formattedReferrer, setFormattedReferrer] = useState<string | null>(null)

  useEffect(() => {
    if (referrer) {
      // Format the address for display
      const formatted = `${referrer.slice(0, 6)}...${referrer.slice(-4)}`
      setFormattedReferrer(formatted)
    }
  }, [referrer])

  if (!formattedReferrer) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`${hasRewarded ? "bg-rainbow-green/10 text-rainbow-green border-rainbow-green/20" : "bg-primary/10 text-primary border-primary/20"} cursor-help`}
          >
            <Users className="h-3 w-3 mr-1" />
            {hasRewarded ? `Rewarded ${formattedReferrer}` : `Referred by ${formattedReferrer}`}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {hasRewarded ? (
            <p className="text-xs">Your referrer received 10 $GRIND tokens!</p>
          ) : (
            <p className="text-xs">Your referrer will receive $GRIND tokens when you complete your first action</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
