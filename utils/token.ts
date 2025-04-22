import type { useToast } from "@/hooks/use-toast"
import { Flame, CoffeeIcon } from "lucide-react"

// Burn address
export const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD"

// Function to burn tokens (for use in components)
export async function burnTokens({
  amount,
  address,
  toast,
  purpose = "burn",
  isSimulated = true,
  burnFunction = null,
}: {
  amount: string
  address: string | undefined
  toast: ReturnType<typeof useToast>["toast"]
  purpose?: "burn" | "reading"
  isSimulated?: boolean
  burnFunction?: ((amount: string) => Promise<any>) | null
}) {
  if (!address || !amount) {
    throw new Error("Missing address or amount")
  }

  try {
    if (isSimulated) {
      // Simulate the burn with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update mock balance in localStorage
      const currentBalance = localStorage.getItem("mock-grind-balance") || "10.0"
      const newBalance = (Number.parseFloat(currentBalance) - Number.parseFloat(amount)).toFixed(2)
      localStorage.setItem("mock-grind-balance", newBalance)

      // Update total burned (for leaderboard)
      const burnedKey = `grindspace-burned-${address}`
      const currentBurned = Number.parseFloat(localStorage.getItem(burnedKey) || "0")
      localStorage.setItem(burnedKey, (currentBurned + Number.parseFloat(amount)).toString())

      // Update total burned (for leaderboard)
      const totalBurnedKey = "grindspace-total-burned"
      const totalBurned = Number.parseFloat(localStorage.getItem(totalBurnedKey) || "0")
      localStorage.setItem(totalBurnedKey, (totalBurned + Number.parseFloat(amount)).toString())
    } else {
      // Use the provided burn function for real blockchain transactions
      if (!burnFunction) {
        throw new Error("Burn function is required for real blockchain transactions")
      }

      // Execute the real blockchain transaction
      await burnFunction(amount)
    }

    // Show success toast based on purpose
    if (purpose === "reading") {
      toast({
        title: "Reading Initiated! ✨",
        description: (
          <div className="flex items-center gap-2">
            <CoffeeIcon className="h-4 w-4 text-primary" />
            <span>You spent {amount} $GRIND tokens for a mystical reading</span>
          </div>
        ),
        variant: "default",
      })
    } else {
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
    }

    return true
  } catch (error) {
    console.error("Error burning tokens:", error)
    throw error
  }
}

// Alias for backward compatibility
export const simulateBurnTokens = burnTokens
