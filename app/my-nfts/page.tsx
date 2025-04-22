"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Coffee, Plus, Wallet } from "lucide-react"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useAccount } from "wagmi"

// Mock NFT data
// TODO: Replace with data from smart contract
const mockNFTs = [
  {
    id: "1",
    name: "Yirgacheffe Sunrise",
    origin: "Ethiopia",
    rarity: "Rare",
    image: "/ethiopian-coffee-harvest.png",
  },
  {
    id: "2",
    name: "Sumatran Darkbite",
    origin: "Indonesia",
    rarity: "Legendary",
    image: "/rich-dark-roast.png",
  },
  {
    id: "3",
    name: "Honduran Bloom",
    origin: "Honduras",
    rarity: "Common",
    image: "/roasted-coffee-pile.png",
  },
  {
    id: "4",
    name: "Colombian Velvet",
    origin: "Colombia",
    rarity: "Rare",
    image: "/emerald-hills-brew.png",
  },
]

// Rarity color mapping
const rarityColors = {
  Common: "bg-muted/10 text-muted-foreground border-muted/20",
  Rare: "bg-rainbow-blue/10 text-rainbow-blue border-rainbow-blue/20",
  Legendary: "bg-primary/10 text-primary border-primary/20",
}

export default function MyNFTsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { address, isConnected } = useAccount() || { address: undefined, isConnected: false }
  const [nfts, setNfts] = useState(mockNFTs)
  const [isMinting, setIsMinting] = useState(false)

  // Format address to show first 6 and last 4 characters
  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleMint = async () => {
    setIsMinting(true)

    try {
      // Simulate minting delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // TODO: Wire real mint call using AGW + useWriteContractSponsored() for gasless tx
      // Example:
      // const { writeContractAsync } = useWriteContractSponsored({
      //   address: COFFEE_NFT_CONTRACT_ADDRESS,
      //   abi: COFFEE_NFT_ABI,
      //   functionName: 'mintRoastNFT',
      //   args: [address],
      // });
      // await writeContractAsync();

      // Add a new NFT to the collection (for demo)
      const newNFT = {
        id: `${nfts.length + 1}`,
        name: "Brazilian Harmony",
        origin: "Brazil",
        rarity: "Common",
        image: "/brazilian-coffee-harvest.png",
      }

      setNfts((prev) => [...prev, newNFT])

      toast({
        title: "Success!",
        description: "NFT minted to your wallet!",
      })
    } catch (error) {
      toast({
        title: "Mint failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-4 text-3xl font-bold tracking-tight font-heading">Your Roast Rewards</h1>

        {/* Wallet Section */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-lg border border-muted/30 bg-background/80 p-4 backdrop-blur sm:flex-row sm:items-center shadow-card">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Connected Wallet:</span>
              <span className="font-medium">{formatAddress(address || "")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Connect your wallet to view your NFTs</span>
            </div>
          )}

          {!isConnected && <ConnectWalletButton />}
        </div>

        <div className="rainbow-divider"></div>

        {/* NFT Grid */}
        {isConnected && (
          <>
            {nfts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {nfts.map((nft) => (
                  <Card key={nft.id} className="group overflow-hidden mc-card">
                    <div className="relative aspect-square overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge
                        variant="outline"
                        className={`absolute right-2 top-2 border ${
                          rarityColors[nft.rarity as keyof typeof rarityColors]
                        }`}
                      >
                        {nft.rarity}
                      </Badge>
                    </div>
                    <CardHeader className="p-3 pb-0">
                      <h3 className="font-bold font-heading">{nft.name}</h3>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <p className="text-sm text-muted-foreground">Origin: {nft.origin}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted/50 bg-muted/5 p-12 text-center">
                <Coffee className="mb-2 h-10 w-10 text-muted-foreground/50" />
                <h3 className="mb-1 text-xl font-medium font-heading">No Roasts Found</h3>
                <p className="mb-4 text-muted-foreground">You haven't collected any roasts yet!</p>
              </div>
            )}

            {/* Mint Button */}
            <div className="mt-6 flex justify-center">
              <Button onClick={handleMint} disabled={isMinting} className="gap-2 mc-button-primary">
                <Plus className="h-4 w-4" />
                {isMinting ? "Minting..." : "Mint Reward NFT"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
