"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Coffee, Home, Award, Gift, ImageIcon, Menu, ShoppingBag, Sparkles, Flame, Shield } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Tip",
    href: "/tip",
    icon: Gift,
  },
  {
    title: "Shop",
    href: "/shop",
    icon: ShoppingBag,
  },
  {
    title: "Rewards",
    href: "/rewards",
    icon: Sparkles,
  },
  {
    title: "Burn",
    href: "/burn",
    icon: Flame,
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Award,
  },
  {
    title: "BearishAF Barista",
    href: "/barista",
    icon: Coffee,
  },
  {
    title: "My NFTs",
    href: "/my-nfts",
    icon: ImageIcon,
  },
  {
    title: "Wallet Safety",
    href: "/safety",
    icon: Shield,
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[75%] max-w-[280px] pr-0 bg-background">
        <div className="px-2 py-6">
          <div className="flex items-center gap-2 px-4 pb-6 font-bold">
            <span className="text-primary">GRIND</span>
            <span className="text-muted-foreground">SPACE</span>
          </div>
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("justify-start", pathname === item.href && "bg-muted/50")}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={item.href}>
                  {item.icon ? <item.icon className="mr-2 h-4 w-4" /> : null}
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
