import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Coffee } from "lucide-react"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-md border-muted/30 bg-background/95 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold tracking-tight">
            <span className="text-primary">GRIND</span>
            <span className="text-muted-foreground">SPACE</span>
          </CardTitle>
          <CardDescription className="text-lg">A cozy digital café for web3 enthusiasts</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 p-6">
          <div className="rounded-full bg-primary/10 p-6">
            <Coffee className="h-16 w-16 text-primary" />
          </div>
          <p className="text-center text-muted-foreground">Connect your wallet to enter the digital café experience</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 p-6">
          <ConnectWalletButton className="w-full" />
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Enter GRINDSPACE</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
