"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Check, AlertTriangle, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SafetyPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="mb-6 flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight font-heading">Wallet Safety</h1>
      </div>

      <div className="rainbow-divider"></div>

      <Card className="mc-card mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-rainbow-green" />
            <CardTitle className="text-2xl font-heading">Grindspace Café is Wallet-Safe</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground text-lg">Your security is our priority</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="rounded-lg border border-rainbow-green/30 bg-rainbow-green/5 p-4">
            <h2 className="mb-3 text-xl font-semibold text-rainbow-green font-heading">🛡️ Safe to Connect</h2>
            <p className="mb-4 text-foreground">
              Your wallet is only used to sign in and interact with our testnet $GRIND token. No approvals, no drains,
              no surprises.
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="mt-1 h-5 w-5 flex-shrink-0 text-rainbow-green" />
                <p>Transactions require user confirmation</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-1 h-5 w-5 flex-shrink-0 text-rainbow-green" />
                <p>All token actions are on Abstract Testnet</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-1 h-5 w-5 flex-shrink-0 text-rainbow-green" />
                <p>No access to real assets or wallets</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-muted/30 p-4">
            <h2 className="mb-3 text-xl font-semibold font-heading">How We Keep You Safe</h2>

            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-lg font-medium text-primary">Testnet Only</h3>
                <p className="text-muted-foreground">
                  Grindspace Café operates exclusively on the Abstract Testnet. This means all tokens and transactions
                  are for demonstration purposes only and have no real-world value.
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-lg font-medium text-primary">Transparent Transactions</h3>
                <p className="text-muted-foreground">
                  Every transaction is clearly explained before you sign it. You'll always know exactly what you're
                  approving, and you can reject any transaction at any time.
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-lg font-medium text-primary">Limited Permissions</h3>
                <p className="text-muted-foreground">
                  We only request the minimum permissions needed to function. We never ask for approval to spend your
                  real tokens or access your mainnet assets.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-rainbow-yellow/30 bg-rainbow-yellow/5 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-rainbow-yellow" />
              <div>
                <h3 className="mb-1 text-lg font-medium text-rainbow-yellow">Always Practice Caution</h3>
                <p className="text-muted-foreground">
                  While Grindspace Café is designed to be safe, always follow general web3 safety practices. Never share
                  your seed phrase, be cautious of phishing attempts, and disconnect your wallet when not in use.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" className="mc-button-outline">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>

            <Button asChild className="mc-button-primary">
              <a
                href="https://abstract.money/security"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Learn About Abstract Wallet Security
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
