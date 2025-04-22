import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-md border-muted/30 bg-background/95 backdrop-blur shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold tracking-tight font-heading">
            <span className="text-primary">GRIND</span>
            <span className="text-foreground">SPACE</span>
          </CardTitle>
          <div className="rainbow-divider mx-auto w-32"></div>
          <CardDescription className="text-lg text-muted-foreground">
            A cozy digital café for web3 enthusiasts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 p-6">
          <div className="relative w-full max-w-[280px]">
            <Image
              src="/beanjahmon-mascot.png"
              alt="Beanjahmon - Grindspace Café mascot"
              width={280}
              height={350}
              className="object-contain"
              priority
            />
          </div>
          <p className="text-center text-muted-foreground">Connect your wallet to enter the digital café experience</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 p-6">
          <ConnectWalletButton className="w-full mc-button-primary" />
          <Button asChild variant="outline" className="w-full mc-button-outline">
            <Link href="/dashboard">Enter GRINDSPACE</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
