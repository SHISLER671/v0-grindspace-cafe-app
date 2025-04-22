"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Coffee, ShoppingBag, AlertCircle, Check } from "lucide-react"
import { useAccount } from "wagmi"
import { useTokenBalance } from "@/hooks/use-token-balance"
import { useWriteContract } from "wagmi"
import { parseUnits } from "viem"
import { GRIND_TOKEN_ADDRESS, ERC20_ABI } from "@/lib/contracts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"

// Mock shop items
const shopItems = [
  {
    id: "1",
    name: "Exclusive Coffee Blend",
    description: "Limited edition Ethiopian blend, only available with $GRIND",
    price: "5",
    image: "/ethiopian-coffee-harvest.png",
  },
  {
    id: "2",
    name: "Barista Masterclass",
    description: "Virtual coffee brewing masterclass with award-winning baristas",
    price: "10",
    image: "/rich-dark-roast.png",
  },
  {
    id: "3",
    name: "Premium Coffee NFT",
    description: "Rare digital collectible with special perks in the Grindspace ecosystem",
    price: "20",
    image: "/emerald-hills-brew.png",
  },
  {
    id: "4",
    name: "Coffee Farm Tour",
    description: "Virtual tour of partner coffee farms around the world",
    price: "15",
    image: "/brazilian-coffee-harvest.png",
  },
]

export default function ShopPage() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { balance } = useTokenBalance(address)
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null)
  const [purchasedItems, setPurchasedItems] = useState<string[]>([])

  // Setup contract write for token transfers
  const { writeContractAsync } = useWriteContract()

  // Treasury address to receive payments
  const treasuryAddress = "0x0000000000000000000000000000000000000001"

  const handlePurchase = async (item: (typeof shopItems)[0]) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make purchases",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    if (Number.parseFloat(balance) < Number.parseFloat(item.price)) {
      toast({
        title: "Insufficient balance",
        description: `You need at least ${item.price} $GRIND to purchase this item`,
        variant: "destructive",
      })
      return
    }

    setIsPurchasing(item.id)

    try {
      // Send the transaction to transfer tokens to treasury
      const hash = await writeContractAsync({
        address: GRIND_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [treasuryAddress, parseUnits(item.price, 18)],
      })

      // In a real app, we would now call a backend API to record the purchase
      // and deliver the digital good or physical product

      // Add to purchased items
      setPurchasedItems((prev) => [...prev, item.id])

      // Show success toast
      toast({
        title: "Purchase successful! ✨",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-rainbow-green" />
            <span>You've purchased {item.name}. Check your email for details.</span>
          </div>
        ),
        variant: "default",
      })
    } catch (error) {
      console.error("Error purchasing item:", error)
      toast({
        title: "Purchase failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-2">
        <ShoppingBag className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight font-heading">Exclusive Shop</h1>
      </div>

      {!isConnected ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Please connect your wallet to browse exclusive items.</AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-primary/10 text-primary border-primary/20 mb-6">
          <Coffee className="h-4 w-4" />
          <AlertTitle>Your $GRIND Balance</AlertTitle>
          <AlertDescription>You have {balance} $GRIND tokens available to spend.</AlertDescription>
        </Alert>
      )}

      <div className="rainbow-divider mb-6"></div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shopItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1 }}
            animate={{
              opacity: purchasedItems.includes(item.id) ? 0.7 : 1,
              scale: purchasedItems.includes(item.id) ? 0.98 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Card
              className={`overflow-hidden mc-card h-full ${purchasedItems.includes(item.id) ? "border-rainbow-green/30" : ""}`}
            >
              <div className="aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-heading">{item.name}</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {item.price} $GRIND
                  </Badge>
                </div>
                <CardDescription className="mt-2 text-muted-foreground">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="mt-2">
                  <Button
                    onClick={() => handlePurchase(item)}
                    className={`w-full mc-button-primary ${purchasedItems.includes(item.id) ? "bg-rainbow-green hover:bg-rainbow-green/90" : ""}`}
                    disabled={
                      !isConnected ||
                      isPurchasing === item.id ||
                      Number.parseFloat(balance) < Number.parseFloat(item.price) ||
                      purchasedItems.includes(item.id)
                    }
                  >
                    {isPurchasing === item.id
                      ? "Processing..."
                      : purchasedItems.includes(item.id)
                        ? "Purchased ✓"
                        : "Purchase"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
