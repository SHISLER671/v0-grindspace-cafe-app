"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Coffee, CreditCard, DollarSign, AlertCircle, Check } from "lucide-react"
import { useAccount } from "wagmi"
import { useTokenBalance } from "@/hooks/use-token-balance"
import { useWriteContract } from "wagmi"
import { parseUnits } from "viem"
import { GRIND_TOKEN_ADDRESS, ERC20_ABI, FARMER_ADDRESSES } from "@/lib/contracts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useReferral } from "@/hooks/use-referral"

// Mock farmer data with images
const farmers = [
  {
    name: "Maria – Honduras",
    address: "0x1234567890123456789012345678901234567890",
    emoji: "🇭🇳",
  },
  {
    name: "Pablo – Peru",
    address: "0x2345678901234567890123456789012345678901",
    emoji: "🇵🇪",
  },
  {
    name: "Kofi – Ghana",
    address: "0x3456789012345678901234567890123456789012",
    emoji: "🇬🇭",
  },
]

export default function TipPage() {
  const { toast } = useToast()
  const [isReading, setIsReading] = useState(false)
  const [farmer, setFarmer] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("GRIND")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFarmerEmoji, setSelectedFarmerEmoji] = useState("")

  // Stripe tipping state
  const [stripeFarmer, setStripeFarmer] = useState("")
  const [stripeAmount, setStripeAmount] = useState("")
  const [isStripeSubmitting, setIsStripeSubmitting] = useState(false)

  // Get account from wagmi
  const { address, isConnected } = useAccount()
  const { balance } = useTokenBalance(address)
  const { rewardReferrer } = useReferral(address)

  // Setup contract write for token transfers
  const { writeContractAsync, isPending } = useWriteContract()

  // Update emoji when farmer changes
  useEffect(() => {
    if (farmer) {
      const selectedFarmer = farmers.find((f) => f.name === farmer)
      if (selectedFarmer) {
        setSelectedFarmerEmoji(selectedFarmer.emoji)
      }
    } else {
      setSelectedFarmerEmoji("")
    }
  }, [farmer])

  const handleSendTip = async () => {
    // Validate form
    if (!farmer || !amount) {
      toast({
        title: "Missing information",
        description: "Please select a farmer and amount",
        variant: "destructive",
      })
      return
    }

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send tips",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (currency === "GRIND") {
        // Determine recipient address (farmer)
        const recipientAddress = FARMER_ADDRESSES[farmer as keyof typeof FARMER_ADDRESSES]

        // Check if user has enough balance
        if (Number.parseFloat(balance) < Number.parseFloat(amount)) {
          throw new Error("Insufficient $GRIND balance")
        }

        // Send the transaction
        const hash = await writeContractAsync({
          address: GRIND_TOKEN_ADDRESS,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [recipientAddress, parseUnits(amount, 18)],
        })

        // Process any pending referral reward
        const rewarded = rewardReferrer()

        // Show success toast
        toast({
          title: "Tip sent successfully! ✨",
          description: (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-rainbow-green" />
              <span>
                You tipped {amount} $GRIND to {farmer}
              </span>
            </div>
          ),
          variant: "default",
        })
      } else {
        // TODO: Implement Stripe integration for USD tips
        console.log("Sending USD tip to", farmer, "amount:", amount)

        // Simulate success for demo
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Process any pending referral reward
        const rewarded = rewardReferrer()

        toast({
          title: "Tip sent successfully! ✨",
          description: (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-rainbow-green" />
              <span>
                You tipped ${amount} USD to {farmer}
              </span>
            </div>
          ),
          variant: "default",
        })
      }

      // Reset form
      setFarmer("")
      setAmount("")
    } catch (error) {
      console.error("Error sending tip:", error)
      toast({
        title: "Error sending tip",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStripePayment = async () => {
    // Validate form
    if (!stripeFarmer || !stripeAmount) {
      toast({
        title: "Missing information",
        description: "Please select a farmer and amount",
        variant: "destructive",
      })
      return
    }

    setIsStripeSubmitting(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Process any pending referral reward
      const rewarded = rewardReferrer()

      // Show redirect toast
      toast({
        title: "Redirecting to Stripe Checkout…",
        description: `Processing ${stripeAmount} payment for ${stripeFarmer}`,
        variant: "default",
      })

      console.log("Redirecting to Stripe for", stripeFarmer, "amount:", stripeAmount)

      // Reset form (in real implementation, this would happen after return from Stripe)
      setTimeout(() => {
        setStripeFarmer("")
        setStripeAmount("")
        setIsStripeSubmitting(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Error processing payment",
        description: "Please try again",
        variant: "destructive",
      })
      setIsStripeSubmitting(false)
    }
  }

  // Check if form is valid
  const isTipFormValid = farmer !== "" && amount !== ""

  return (
    <div className="container mx-auto max-w-md px-4 py-6 space-y-6">
      {!isConnected && (
        <Alert className="bg-rainbow-blue/10 text-rainbow-blue border-rainbow-blue/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connect your wallet</AlertTitle>
          <AlertDescription>
            Connect your wallet to send tips with $GRIND tokens. Your connection will persist across all pages until you
            sign out.
          </AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <Alert className="bg-primary/10 text-primary border-primary/20">
          <Coffee className="h-4 w-4" />
          <AlertTitle>Your $GRIND Balance</AlertTitle>
          <AlertDescription>You have {balance} $GRIND tokens available to tip farmers.</AlertDescription>
        </Alert>
      )}

      <div className="rainbow-divider"></div>

      {/* Crypto Tipping Card */}
      <Card className="mc-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-heading">
            <Coffee className="h-5 w-5 text-primary" />
            Tip with Crypto
          </CardTitle>
          <CardDescription className="text-muted-foreground">Support farmers with $GRIND or USD crypto</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Farmer Selection */}
          <div className="space-y-2">
            <Label htmlFor="farmer">Select a Farmer</Label>
            <Select value={farmer} onValueChange={setFarmer}>
              <SelectTrigger id="farmer" className="w-full">
                <SelectValue placeholder="Choose a farmer" />
              </SelectTrigger>
              <SelectContent>
                {farmers.map((f) => (
                  <SelectItem key={f.name} value={f.name}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{f.emoji}</span>
                      <span>{f.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFarmerEmoji && (
              <div className="mt-2 p-2 bg-muted/20 rounded-md flex items-center justify-center">
                <span className="text-4xl">{selectedFarmerEmoji}</span>
              </div>
            )}
          </div>

          {/* Amount Selection */}
          <div className="space-y-2">
            <Label htmlFor="amount">Enter Amount</Label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {currency === "GRIND" ? (
                  <Coffee className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Enter any amount you'd like to tip</p>
          </div>

          {/* Currency Selection */}
          <div className="space-y-2">
            <Label>Select Currency</Label>
            <RadioGroup value={currency} onValueChange={setCurrency} className="flex">
              <div className="flex items-center space-x-2 rounded-md border border-primary/30 bg-primary/5 p-3 flex-1">
                <RadioGroupItem value="GRIND" id="grind" />
                <Label htmlFor="grind" className="flex items-center gap-1 cursor-pointer">
                  <Coffee className="h-4 w-4" />
                  $GRIND
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-muted/30 p-3 flex-1">
                <RadioGroupItem value="USD" id="usd" />
                <Label htmlFor="usd" className="flex items-center gap-1 cursor-pointer">
                  <DollarSign className="h-4 w-4" />
                  USD
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSendTip}
            className="w-full mc-button-primary"
            disabled={isSubmitting || !isTipFormValid || !isConnected || isPending}
          >
            {isSubmitting || isPending ? "Processing..." : "Send Tip"}
          </Button>
        </CardFooter>
      </Card>

      {/* Stripe Tipping Card */}
      <Card className="mc-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-heading">
            <CreditCard className="h-5 w-5 text-primary" />
            Tip with Fiat (via Stripe)
          </CardTitle>
          <CardDescription className="text-muted-foreground">Support farmers with credit or debit card</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Farmer Selection */}
          <div className="space-y-2">
            <Label htmlFor="stripe-farmer">Select a Farmer</Label>
            <Select value={stripeFarmer} onValueChange={setStripeFarmer}>
              <SelectTrigger id="stripe-farmer" className="w-full">
                <SelectValue placeholder="Choose a farmer" />
              </SelectTrigger>
              <SelectContent>
                {farmers.map((f) => (
                  <SelectItem key={f.name} value={f.name}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{f.emoji}</span>
                      <span>{f.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2">
            <Label>Select Amount</Label>
            <RadioGroup value={stripeAmount} onValueChange={setStripeAmount} className="grid grid-cols-3 gap-2">
              {["1", "2", "5"].map((value) => (
                <div key={value} className="flex items-center space-x-2 rounded-md border border-muted/30 p-3">
                  <RadioGroupItem value={value} id={`stripe-${value}`} />
                  <Label htmlFor={`stripe-${value}`} className="flex items-center gap-1 cursor-pointer">
                    ${value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleStripePayment}
            className="w-full mc-button-outline"
            variant="outline"
            disabled={isStripeSubmitting || !stripeFarmer || !stripeAmount}
          >
            {isStripeSubmitting ? "Processing..." : "Pay with Card"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
