"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useTokenBalance } from "@/hooks/use-token-balance"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, AlertCircle, Coffee, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { motion, AnimatePresence } from "framer-motion"
import { useReferral } from "@/hooks/use-referral"
import { simulateBurnTokens } from "@/utils/token"

// Mock leaderboard data
const initialLeaderboard = [
  { address: "0xdead...beef", amount: "1000" },
  { address: "0xcafe...babe", amount: "750" },
  { address: "0xf00d...cafe", amount: "500" },
  { address: "0xa1b2...c3d4", amount: "250" },
  { address: "0xe5f6...7890", amount: "100" },
]

// Beanjahmon quotes
const quotes = [
  "A worthy tribute, mi fren. Beanjahmon sees all...",
  "The beans speak through the flames, ya know?",
  "When you burn, you learn. That's the cosmic cycle, mon.",
  "Fire purifies the soul, just like heat roasts the bean.",
  "Your sacrifice feeds the eternal grind. Respect.",
]

export default function BurnPage() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { balance, isLoading } = useTokenBalance(address)
  const { processReferralReward } = useReferral()

  const [burnAmount, setBurnAmount] = useState<string>("10")
  const [isBurning, setIsBurning] = useState(false)
  const [totalBurned, setTotalBurned] = useState<string>("0")
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard)
  const [quote, setQuote] = useState(quotes[0])
  const [isFireActive, setIsFireActive] = useState(false)

  // Load total burned amount from localStorage
  useEffect(() => {
    const storedTotal = localStorage.getItem("grindspace-total-burned")
    if (storedTotal) {
      setTotalBurned(storedTotal)
    }

    // Load leaderboard from localStorage
    const storedLeaderboard = localStorage.getItem("grindspace-burn-leaderboard")
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard))
    }

    // Set random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Handle burn action
  const handleBurn = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make offerings",
        variant: "destructive",
      })
      return
    }

    // Check if amount is valid
    const amount = Number.parseFloat(burnAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to sacrifice",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    if (Number.parseFloat(balance) < amount) {
      toast({
        title: "Insufficient balance",
        description: `You need at least ${amount} $GRIND to make this offering`,
        variant: "destructive",
      })
      return
    }

    setIsBurning(true)
    setIsFireActive(true)

    // Use the simulateBurnTokens utility function
    simulateBurnTokens({
      amount: burnAmount,
      address,
      toast,
    })
      .then(async () => {
        // Process any pending referral reward
        await processReferralReward()

        // Update leaderboard
        if (address) {
          const formattedAddress = formatAddress(address)
          const existingEntry = leaderboard.find((entry) => entry.address === formattedAddress)

          let newLeaderboard
          if (existingEntry) {
            // Update existing entry
            newLeaderboard = leaderboard.map((entry) =>
              entry.address === formattedAddress
                ? { ...entry, amount: (Number.parseFloat(entry.amount) + amount).toString() }
                : entry,
            )
          } else {
            // Add new entry
            newLeaderboard = [...leaderboard, { address: formattedAddress, amount: amount.toString() }]
          }

          // Sort leaderboard by amount (descending)
          newLeaderboard.sort((a, b) => Number.parseFloat(b.amount) - Number.parseFloat(a.amount))

          // Keep only top 5
          newLeaderboard = newLeaderboard.slice(0, 5)

          setLeaderboard(newLeaderboard)
          localStorage.setItem("grindspace-burn-leaderboard", JSON.stringify(newLeaderboard))
        }

        // Set new random quote
        setQuote(quotes[Math.floor(Math.random() * quotes.length)])

        setIsBurning(false)

        // Turn off fire effect after a delay
        setTimeout(() => {
          setIsFireActive(false)
        }, 3000)
      })
      .catch((error) => {
        console.error("Error burning tokens:", error)
        toast({
          title: "Error burning tokens",
          description: "Please try again later",
          variant: "destructive",
        })
        setIsBurning(false)
        setIsFireActive(false)
      })
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setBurnAmount(value[0].toString())
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-2">
        <Flame className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight font-heading">Burn Offerings</h1>
      </div>

      {!isConnected ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Please connect your wallet to make offerings to Beanjahmon.</AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-primary/10 text-primary border-primary/20 mb-6">
          <Coffee className="h-4 w-4" />
          <AlertTitle>Your $GRIND Balance</AlertTitle>
          <AlertDescription>You have {balance} $GRIND tokens available for offerings.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Burn Offering Card */}
        <Card className="overflow-hidden border-muted/30 bg-background/95 backdrop-blur shadow-card relative">
          <div className="absolute inset-0 bg-[url('/pixel-smoke.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-2xl font-heading">
              <Flame className="h-5 w-5 text-primary" />
              Sacrifice to Beanjahmon
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Burn $GRIND tokens as an offering to the mystical coffee guru
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Beanjahmon Avatar and Quote */}
            <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-muted/20 border border-muted/30">
              <div className="relative">
                <Avatar className="h-24 w-24 rounded-full border-2 border-primary/50">
                  <AvatarImage src="/beanjahmon-avatar.png" alt="Beanjahmon" className="object-cover" />
                  <AvatarFallback className="bg-secondary text-primary text-2xl">BJ</AvatarFallback>
                </Avatar>

                {/* Fire effect */}
                <AnimatePresence>
                  {isFireActive && (
                    <motion.div
                      className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Flame className="h-12 w-12 text-primary animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-center">
                <p className="text-lg italic text-foreground">"{quote}"</p>
                <p className="text-sm text-muted-foreground mt-2">- Beanjahmon, Coffee Mystic</p>
              </div>
            </div>

            {/* Burn Amount Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Offering Amount</span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {burnAmount} $GRIND
                </Badge>
              </div>

              <div className="pt-4">
                <Slider
                  defaultValue={[10]}
                  max={isConnected ? Math.max(Number.parseFloat(balance), 100) : 100}
                  step={1}
                  onValueChange={handleSliderChange}
                  disabled={isBurning || !isConnected}
                  className="mb-6"
                />

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    min="1"
                    max={isConnected ? balance : "100"}
                    disabled={isBurning || !isConnected}
                    className="bg-muted/20 border-muted/30"
                  />
                  <span className="text-sm text-muted-foreground">$GRIND</span>
                </div>
              </div>
            </div>

            {/* Burn Button */}
            {isConnected ? (
              <Button
                onClick={handleBurn}
                disabled={isBurning || Number.parseFloat(balance) < Number.parseFloat(burnAmount)}
                className="w-full gap-2 bg-gradient-to-r from-red-500 to-primary hover:from-red-600 hover:to-primary/90 text-foreground font-medium"
              >
                {isBurning ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Sacrificing...
                  </>
                ) : (
                  <>
                    <Flame className="h-4 w-4" />🔥 Sacrifice to Beanjahmon
                  </>
                )}
              </Button>
            ) : (
              <ConnectWalletButton className="w-full" />
            )}

            {/* Total Burned Counter */}
            <div className="rounded-lg border border-muted/30 p-4 bg-muted/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total $GRIND Sacrificed</span>
                <span className="font-bold text-primary">{totalBurned}</span>
              </div>
              <Progress value={Math.min((Number.parseFloat(totalBurned) / 10000) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                The eternal flames grow stronger with each offering
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Card */}
        <Card className="border-muted/30 bg-background/95 backdrop-blur shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-heading">
              <Trophy className="h-5 w-5 text-primary" />
              Burn Leaderboard
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              The most devoted followers of Beanjahmon
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">
              {leaderboard.map((entry, index) => {
                const rankColors = [
                  "bg-primary/10 text-primary border-primary/20", // 1st
                  "bg-muted/10 text-muted-foreground border-muted/20", // 2nd
                  "bg-rainbow-yellow/10 text-rainbow-yellow border-rainbow-yellow/20", // 3rd
                  "bg-muted/10 text-muted-foreground border-muted/20", // 4th
                  "bg-muted/10 text-muted-foreground border-muted/20", // 5th
                ]

                const rankEmojis = ["🥇", "🥈", "🥉", "4", "5"]

                return (
                  <li
                    key={entry.address}
                    className="flex items-center justify-between rounded-lg border border-muted/20 p-3 transition-all hover:bg-muted/5"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`h-7 w-7 justify-center rounded-full ${rankColors[index]}`}>
                        {rankEmojis[index]}
                      </Badge>
                      <span className="font-medium">{entry.address}</span>
                    </div>
                    <span className="font-semibold text-primary">{entry.amount} $GRIND</span>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6 p-4 rounded-lg bg-muted/10 border border-muted/30 text-center">
              <p className="text-sm text-muted-foreground">
                "Those who sacrifice the most shall receive the greatest wisdom."
              </p>
              <p className="text-xs text-muted-foreground mt-1">- Ancient Beanjahmon Proverb</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
