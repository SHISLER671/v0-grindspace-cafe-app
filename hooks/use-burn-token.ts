"use client"

import { useWriteContractSponsored } from "@abstract-foundation/agw-react"
import { GRIND_TOKEN_ADDRESS, ERC20_ABI } from "@/lib/contracts"
import { parseUnits } from "viem"
import { useState } from "react"

export function useBurnToken() {
  const { writeContractSponsored, isPending } = useWriteContractSponsored()
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const burnTokens = async (amount: string) => {
    setIsSuccess(false)
    setError(null)

    try {
      // Convert amount to proper decimal representation (18 decimals for $GRIND)
      const burnAmount = parseUnits(amount, 18)

      // Execute the sponsored transaction
      const result = await writeContractSponsored({
        address: GRIND_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "burn", // Make sure your token has a burn function
        args: [burnAmount],
      })

      // Update local storage for UI consistency
      const currentBalance = localStorage.getItem("mock-grind-balance") || "0"
      const newBalance = (Number.parseFloat(currentBalance) - Number.parseFloat(amount)).toFixed(2)
      localStorage.setItem("mock-grind-balance", newBalance)

      // Update total burned (for leaderboard)
      const totalBurnedKey = "grindspace-total-burned"
      const totalBurned = Number.parseFloat(localStorage.getItem(totalBurnedKey) || "0")
      localStorage.setItem(totalBurnedKey, (totalBurned + Number.parseFloat(amount)).toString())

      setIsSuccess(true)
      return result
    } catch (err) {
      console.error("Error burning tokens:", err)
      setError(err instanceof Error ? err : new Error("Failed to burn tokens"))
      throw err
    }
  }

  return {
    burnTokens,
    isPending,
    isSuccess,
    error,
  }
}
