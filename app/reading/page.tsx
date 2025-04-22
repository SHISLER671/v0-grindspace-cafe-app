"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Coffee, AlertCircle, Sparkles, CoffeeIcon } from "lucide-react"
import { coffeeReadings } from "@/data/coffeeReadings"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useAccount } from "wagmi"
import { useWriteContractSponsored } from "@abstract-foundation/agw-react"
import { GRIND_TOKEN_ADDRESS, ERC20_ABI } from "@/lib/contracts"
import { parseUnits } from "viem"

import "./reading-styles.css"

// Cost of a reading in $GRIND tokens
const READING_COST = "4.20"

// Cooldown time in seconds
const COOLDOWN_TIME = 5

export default function ReadingPage() {
  const { toast } = useToast()
  const [isReading, setIsReading] = useState(false)
  const [hasReading, setHasReading] = useState(false)
  const [readingResult, setReadingResult] = useState<(typeof coffeeReadings)[0] | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [transactionError, setTransactionError] = useState<string | null>(null)

  // Get account from wagmi
  const { address, isConnected } = useAccount()

  // Get sponsored transaction function from Abstract
  const { writeContractSponsored, isPending: isTransactionPending } = useWriteContractSponsored()

  // Mock wallet state for preview (only used if real wallet not connected)
  const [mockBalance, setMockBalance] = useState("10.0")
  const [mockAddress, setMockAddress] = useState<string | undefined>(undefined)

  // Initialize mock wallet on component mount (only if real wallet not connected)
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined" && !isConnected) {
      // Check if there's a stored connection state
      const storedConnection = localStorage.getItem("agw-connection")
      if (storedConnection === "true") {
        setMockAddress("0x1234567890123456789012345678901234567890")

        // Get stored balance or set default
        const storedBalance = localStorage.getItem("mock-grind-balance")
        if (storedBalance) {
          setMockBalance(storedBalance)
        } else {
          localStorage.setItem("mock-grind-balance", mockBalance)
        }
      }
    }
  }, [isConnected, mockBalance])

  // Get the effective balance (real or mock)
  const balance = isConnected ? "10.0" : mockBalance // In a real app, this would come from useTokenBalance
  const effectiveAddress = address || mockAddress

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  // Mock connect wallet function
  const connectWallet = () => {
    setMockAddress("0x1234567890123456789012345678901234567890")
    localStorage.setItem("agw-connection", "true")

    // Set initial balance if not already set
    if (!localStorage.getItem("mock-grind-balance")) {
      localStorage.setItem("mock-grind-balance", "10.0")
    }
    setMockBalance(localStorage.getItem("mock-grind-balance") || "10.0")
  }

  // Handle getting a reading
  const handleGetReading = async () => {
    if (!isConnected && !mockAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to get a reading",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    if (Number.parseFloat(balance) < Number.parseFloat(READING_COST)) {
      toast({
        title: "Insufficient balance",
        description: `You need at least ${READING_COST} $GRIND to get a reading`,
        variant: "destructive",
      })
      return
    }

    setIsReading(true)
    setTransactionError(null)

    try {
      if (isConnected && address) {
        // REAL BLOCKCHAIN TRANSACTION
        // This will trigger the Abstract Wallet popup for approval
        const result = await writeContractSponsored({
          address: GRIND_TOKEN_ADDRESS,
          abi: ERC20_ABI,
          functionName: "transfer", // Using transfer instead of burn for compatibility
          args: ["0x000000000000000000000000000000000000dEaD", parseUnits(READING_COST, 18)], // Send to burn address
        })

        console.log("Transaction submitted:", result)

        // Update local storage for UI consistency
        const currentBalance = localStorage.getItem("mock-grind-balance") || "10.0"
        const newBalance = (Number.parseFloat(currentBalance) - Number.parseFloat(READING_COST)).toFixed(2)
        localStorage.setItem("mock-grind-balance", newBalance)

        // Update total burned (for leaderboard)
        const totalBurnedKey = "grindspace-total-burned"
        const totalBurned = Number.parseFloat(localStorage.getItem(totalBurnedKey) || "0")
        localStorage.setItem(totalBurnedKey, (totalBurned + Number.parseFloat(READING_COST)).toString())
      } else {
        // SIMULATED TRANSACTION (for demo/preview)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update mock balance in localStorage
        const currentBalance = localStorage.getItem("mock-grind-balance") || "10.0"
        const newBalance = (Number.parseFloat(currentBalance) - Number.parseFloat(READING_COST)).toFixed(2)
        localStorage.setItem("mock-grind-balance", newBalance)

        // Update mock balance state
        setMockBalance(newBalance)
      }

      toast({
        title: "Reading Initiated! ✨",
        description: (
          <div className="flex items-center gap-2">
            <CoffeeIcon className="h-4 w-4 text-primary" />
            <span>You spent {READING_COST} $GRIND tokens for a mystical reading</span>
          </div>
        ),
        variant: "default",
      })

      // Start the reveal animation
      setIsRevealing(true)

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random reading
      const randomIndex = Math.floor(Math.random() * coffeeReadings.length)
      setReadingResult(coffeeReadings[randomIndex])
      setHasReading(true)

      toast({
        title: "Reading Complete! ✨",
        description: "The coffee beans have revealed your fortune",
        variant: "default",
      })

      // Start cooldown
      setCooldown(COOLDOWN_TIME)
    } catch (error) {
      console.error("Error getting reading:", error)
      setTransactionError("Transaction failed. Please try again.")
      toast({
        title: "Error getting reading",
        description: "Blockchain transaction failed. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsReading(false)
      setIsRevealing(false)
    }
  }

  // Custom connect wallet button that uses our mock function
  const CustomConnectButton = () => (
    <Button onClick={connectWallet} className="w-full gap-2 mc-button-primary">
      <Coffee className="h-4 w-4" />
      Connect Wallet
    </Button>
  )

  // Format wallet address for display
  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-[#0E1A26]">
      <div className="mb-6 flex items-center justify-center gap-2">
        <CoffeeIcon className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight font-heading">Coffee Bean Reading</h1>
      </div>

      {!isConnected && !mockAddress ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Please connect your wallet to get a coffee bean reading.</AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-[#0E1A26] text-primary border-primary/20 mb-6 rounded-lg">
          <Coffee className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Your $GRIND Balance</AlertTitle>
          <AlertDescription className="text-[#FDF2D0]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span>You have {balance} $GRIND tokens available for readings.</span>
              {effectiveAddress && (
                <Badge
                  variant="outline"
                  className="bg-transparent text-muted-foreground border-muted/20 self-start sm:self-auto"
                >
                  Wallet: {formatAddress(effectiveAddress)}
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {transactionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Transaction Failed</AlertTitle>
          <AlertDescription>{transactionError}</AlertDescription>
        </Alert>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Reading Card */}
          <Card className="overflow-hidden border-muted/30 bg-[#0E1A26] backdrop-blur shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl font-heading">
                <CoffeeIcon className="h-5 w-5 text-primary" />
                Coffee Bean Reading
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Burn {READING_COST} $GRIND tokens to receive a mystical coffee bean reading
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 flex flex-col items-center">
              {/* Coffee Cup Placeholder */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <img
                    src="/readings/coffee-cup-empty.png"
                    alt="Empty coffee cup"
                    className="w-full h-full object-contain"
                  />

                  {/* Steam animation */}
                  {isRevealing && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                      <div className="steam-container">
                        <div className="steam steam-one"></div>
                        <div className="steam steam-two"></div>
                        <div className="steam steam-three"></div>
                        <div className="steam steam-four"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reading Cost Badge */}
              <div className="flex justify-center">
                <Badge
                  variant="outline"
                  className="bg-transparent text-primary border-primary/20 text-sm px-4 py-1 rounded-full"
                >
                  Cost: {READING_COST} $GRIND
                </Badge>
              </div>

              {/* Get Reading Button */}
              {isConnected || mockAddress ? (
                <Button
                  onClick={handleGetReading}
                  disabled={
                    isReading ||
                    isTransactionPending ||
                    cooldown > 0 ||
                    Number.parseFloat(balance) < Number.parseFloat(READING_COST)
                  }
                  className="w-full gap-2 bg-gradient-to-r from-[#F8A325] to-[#1984C5] hover:from-[#F8A325]/90 hover:to-[#1984C5]/90 text-foreground font-medium shadow-glow transition-all relative overflow-hidden py-6"
                >
                  {isReading || isTransactionPending ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      {isTransactionPending ? "Waiting for approval..." : "Reading the beans..."}
                    </>
                  ) : cooldown > 0 ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Cooldown: {cooldown}s
                    </>
                  ) : (
                    <>
                      <CoffeeIcon className="h-4 w-4" />✨ Read the Beans ✨
                      <span className="absolute inset-0 shimmer-effect"></span>
                    </>
                  )}
                </Button>
              ) : (
                <CustomConnectButton />
              )}

              <p className="text-center text-xs text-muted-foreground">
                The ancient art of tasseography reveals the patterns of your destiny
              </p>
            </CardContent>
          </Card>

          {/* Reading Result Card */}
          <Card className="overflow-hidden border-muted/30 bg-[#0E1A26] backdrop-blur shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl font-heading">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Reading
              </CardTitle>
              <CardDescription className="text-muted-foreground">The coffee beans reveal your fortune</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence>
                {hasReading && readingResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-lg border border-primary/20 bg-[#0E1A26] p-6 text-center"
                  >
                    <div className="mb-6 flex justify-center">
                      <div className="relative w-48 h-48 border-2 border-primary/30 shadow-glow">
                        <img
                          src={`/readings/${readingResult.image}`}
                          alt="Coffee bean reading"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-lg italic text-[#FDF2D0]">{readingResult.text}</p>
                    <div className="mt-4 flex justify-center">
                      <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                  </motion.div>
                ) : (
                  <div className="rounded-lg border border-dashed border-muted/50 bg-[#0E1A26] p-12 text-center h-[400px] flex flex-col items-center justify-center">
                    <Coffee className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mb-2 text-xl font-medium font-heading">No Reading Yet</h3>
                    <p className="text-muted-foreground">
                      Burn {READING_COST} $GRIND tokens to receive your mystical coffee bean reading
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 font-heading text-center">What Others Say About Their Readings</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-[#0E1A26] border-muted/30">
              <CardContent className="p-4">
                <p className="italic text-sm mb-2 text-[#FDF2D0]">
                  "The beans revealed my true path. A week later, I got the job offer of my dreams!"
                </p>
                <p className="text-xs text-muted-foreground">— 0xdead...beef</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0E1A26] border-muted/30">
              <CardContent className="p-4">
                <p className="italic text-sm mb-2 text-[#FDF2D0]">
                  "I was skeptical, but the reading warned me about a false opportunity. Saved me from a rug pull!"
                </p>
                <p className="text-xs text-muted-foreground">— 0xcafe...babe</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0E1A26] border-muted/30">
              <CardContent className="p-4">
                <p className="italic text-sm mb-2 text-[#FDF2D0]">
                  "The beans don't lie. My reading predicted unexpected wealth and I found 0.5 ETH in an old wallet!"
                </p>
                <p className="text-xs text-muted-foreground">— 0xf00d...cafe</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
