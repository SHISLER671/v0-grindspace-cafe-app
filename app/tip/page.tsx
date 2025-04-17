"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Coffee, CreditCard, DollarSign } from "lucide-react"

export default function TipPage() {
  const { toast } = useToast()

  // Crypto tipping state
  const [farmer, setFarmer] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("GRIND")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Stripe tipping state
  const [stripeFarmer, setStripeFarmer] = useState("")
  const [stripeAmount, setStripeAmount] = useState("")
  const [isStripeSubmitting, setIsStripeSubmitting] = useState(false)

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

    setIsSubmitting(true)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (currency === "GRIND") {
        // TODO: Implement smart contract integration for $GRIND tips
        // This would include:
        // 1. Connect to wallet
        // 2. Create transaction to send $GRIND tokens
        // 3. Wait for transaction confirmation
        console.log("Sending $GRIND tip to", farmer, "amount:", amount)
      } else {
        // TODO: Implement Stripe integration for USD tips
        // This would include:
        // 1. Create Stripe payment intent
        // 2. Redirect to Stripe checkout or show Stripe Elements
        // 3. Handle payment success/failure
        console.log("Sending USD tip to", farmer, "amount:", amount)
      }

      // Show success toast
      toast({
        title: "Tip sent!",
        description: `You tipped ${amount} ${currency} to ${farmer}`,
      })

      // Reset form
      setFarmer("")
      setAmount("")
    } catch (error) {
      toast({
        title: "Error sending tip",
        description: "Please try again",
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

      // TODO: Implement Stripe Checkout
      // 1. Create a payment intent on the server
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     farmer: stripeFarmer,
      //     amount: stripeAmount,
      //     currency: 'usd'
      //   })
      // });
      //
      // 2. Redirect to Stripe Checkout
      // const { sessionId } = await response.json();
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      // stripe.redirectToCheckout({ sessionId });

      // Show redirect toast
      toast({
        title: "Redirecting to Stripe Checkout…",
        description: `Processing $${stripeAmount} payment for ${stripeFarmer}`,
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

  return (
    <div className="container mx-auto max-w-md px-4 py-6 space-y-6">
      {/* Crypto Tipping Card */}
      <Card className="border-muted/30 bg-background/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Coffee className="h-5 w-5 text-primary" />
            Tip with Crypto
          </CardTitle>
          <CardDescription>Support farmers with $GRIND or USD crypto</CardDescription>
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
                <SelectItem value="Maria – Honduras">Maria – Honduras</SelectItem>
                <SelectItem value="Pablo – Peru">Pablo – Peru</SelectItem>
                <SelectItem value="Kofi – Ghana">Kofi – Ghana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2">
            <Label>Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {["0.5", "1", "2"].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={amount === value ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setAmount(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div className="space-y-2">
            <Label>Select Currency</Label>
            <RadioGroup value={currency} onValueChange={setCurrency} className="flex">
              <div className="flex items-center space-x-2 rounded-md border border-muted/30 p-3 flex-1">
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
          <Button onClick={handleSendTip} className="w-full" disabled={isSubmitting || !farmer || !amount}>
            {isSubmitting ? "Processing..." : "Send Tip"}
          </Button>
        </CardFooter>
      </Card>

      {/* Stripe Tipping Card */}
      <Card className="border-muted/30 bg-background/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CreditCard className="h-5 w-5 text-primary" />
            Tip with Fiat (via Stripe)
          </CardTitle>
          <CardDescription>Support farmers with credit or debit card</CardDescription>
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
                <SelectItem value="Maria – Honduras">Maria – Honduras</SelectItem>
                <SelectItem value="Pablo – Peru">Pablo – Peru</SelectItem>
                <SelectItem value="Kofi – Ghana">Kofi – Ghana</SelectItem>
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
            className="w-full"
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
