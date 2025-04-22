"use client"

import { useState, useEffect } from "react"
import { useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { GRIND_TOKEN_ADDRESS, ERC20_ABI } from "@/lib/contracts"

export function useTokenBalance(address: string | undefined) {
  const [formattedBalance, setFormattedBalance] = useState<string>("0")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { data: balance, isError } = useReadContract({
    address: GRIND_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  useEffect(() => {
    if (balance !== undefined) {
      // Format the balance with 2 decimal places for display
      setFormattedBalance(Number.parseFloat(formatUnits(balance as bigint, 18)).toFixed(2))
      setIsLoading(false)
    } else if (isError) {
      setFormattedBalance("0")
      setIsLoading(false)
    }
  }, [balance, isError])

  return { balance: formattedBalance, isLoading }
}
