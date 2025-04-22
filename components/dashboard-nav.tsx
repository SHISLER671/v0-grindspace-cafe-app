"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Coffee, Home, Award, Gift, ImageIcon, ShoppingBag, Sparkles, Shield, CoffeeIcon } from "lucide-react"

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
    title: "Coffee Reading",
    href: "/reading",
    icon: CoffeeIcon,
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

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 px-2">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "justify-start font-medium",
            pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-primary/5 hover:text-primary",
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
      <div className="rainbow-divider mt-2"></div>
    </nav>
  )
}
