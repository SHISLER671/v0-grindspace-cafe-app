import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { MobileNav } from "@/components/mobile-nav"
import { WalletDisplay } from "@/components/wallet-display"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | GRINDSPACE Café",
  description: "Manage your $GRIND tokens, referrals, and coffee experiences.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-heading font-bold">
            <span className="text-primary">GRIND</span>
            <span className="text-foreground">SPACE</span>
          </div>
          <WalletDisplay />
          <MobileNav />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 md:py-6">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-border/40 py-6 pr-2 md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden p-4 md:py-6">{children}</main>
      </div>
      <footer className="border-t border-border/40 py-4 bg-background/95">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <div className="rainbow-divider"></div>
          <p>© 2025 GRINDSPACE Café. Connecting people through coffee.</p>
        </div>
      </footer>
    </div>
  )
}
