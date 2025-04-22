"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Constants
const REFERRAL_STORAGE_KEY = "grindspace-referrer"
const REFERRAL_CLAIMED_KEY_PREFIX = "grindspace-referral-claimed-"
const REFERRAL_EARNINGS_KEY_PREFIX = "grindspace-referral-earned-"
const REFERRAL_REWARD_AMOUNT = 10 // 10 $GRIND tokens

export function useReferral(userAddress?: string) {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [referralLink, setReferralLink] = useState<string>("")
  const [referrer, setReferrer] = useState<string | null>(null)
  const [hasRewarded, setHasRewarded] = useState<boolean>(false)
  const [isCopying, setIsCopying] = useState<boolean>(false)
  const [referralEarnings, setReferralEarnings] = useState<number>(0)
  const [totalReferrals, setTotalReferrals] = useState<number>(0)

  // Generate referral link when address is available
  useEffect(() => {
    if (userAddress) {
      // Use the current origin (works in both development and production)
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      setReferralLink(`${origin}/?ref=${userAddress}`)
    }
  }, [userAddress])

  // Check for referral parameter and store it if present
  useEffect(() => {
    const ref = searchParams?.get("ref")
    const storedReferrer = localStorage.getItem(REFERRAL_STORAGE_KEY)

    if (ref && userAddress) {
      // Prevent self-referrals
      if (ref.toLowerCase() === userAddress.toLowerCase()) {
        console.log("Self-referral detected, ignoring")
        return
      }

      // Only store if we don't already have one (first referrer wins)
      if (!storedReferrer) {
        localStorage.setItem(REFERRAL_STORAGE_KEY, ref)
        setReferrer(ref)
        console.log(`Referrer ${ref} stored`)
      }
    } else if (storedReferrer) {
      setReferrer(storedReferrer)
    }
  }, [searchParams, userAddress])

  // Check if the referral has been claimed
  useEffect(() => {
    if (userAddress) {
      const claimedKey = `${REFERRAL_CLAIMED_KEY_PREFIX}${userAddress}`
      const claimed = localStorage.getItem(claimedKey) === "true"
      setHasRewarded(claimed)

      // Load referral earnings
      const earningsKey = `${REFERRAL_EARNINGS_KEY_PREFIX}${userAddress}`
      const earnings = Number.parseInt(localStorage.getItem(earningsKey) || "0")
      setReferralEarnings(earnings)

      // Calculate total referrals (assuming 10 $GRIND per referral)
      setTotalReferrals(Math.floor(earnings / REFERRAL_REWARD_AMOUNT))
    }
  }, [userAddress])

  // Copy referral link to clipboard
  const copyReferralLink = async () => {
    if (!referralLink) return

    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(referralLink)
      toast({
        title: "Referral link copied!",
        description: "Share it with friends to earn $GRIND rewards",
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

  // Process referral reward (simplified version using localStorage)
  const rewardReferrer = () => {
    // Only proceed if we have a stored referrer and haven't claimed yet
    if (!referrer || !userAddress || hasRewarded) {
      return false
    }

    // Prevent self-referrals (double-check)
    if (referrer.toLowerCase() === userAddress.toLowerCase()) {
      return false
    }

    try {
      // Update referrer's earnings
      const earningsKey = `${REFERRAL_EARNINGS_KEY_PREFIX}${referrer}`
      const currentEarnings = Number.parseInt(localStorage.getItem(earningsKey) || "0")
      localStorage.setItem(earningsKey, (currentEarnings + REFERRAL_REWARD_AMOUNT).toString())

      // Mark referral as claimed
      const claimedKey = `${REFERRAL_CLAIMED_KEY_PREFIX}${userAddress}`
      localStorage.setItem(claimedKey, "true")
      setHasRewarded(true)

      // Show success toast
      toast({
        title: "Referral Reward Sent!",
        description: `${REFERRAL_REWARD_AMOUNT} $GRIND tokens sent to your referrer`,
      })

      return true
    } catch (error) {
      console.error("Error processing referral reward:", error)
      return false
    }
  }

  // Get referral earnings for any address
  const getReferralEarnings = (address?: string) => {
    if (!address) return 0

    const earningsKey = `${REFERRAL_EARNINGS_KEY_PREFIX}${address}`
    return Number.parseInt(localStorage.getItem(earningsKey) || "0")
  }

  return {
    referralLink,
    referrer,
    hasRewarded,
    isCopying,
    referralEarnings,
    totalReferrals,
    copyReferralLink,
    rewardReferrer,
    getReferralEarnings,
  }
}
