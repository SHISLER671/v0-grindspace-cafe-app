"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Coffee, Home, Award, Gift, ImageIcon } from "lucide-react"

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
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Award,
  },
  {
    title: "Barista",
    href: "/barista",
    icon: Coffee,
  },
  {
    title: "My NFTs",
    href: "/my-nfts",
    icon: ImageIcon,
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
          className={cn("justify-start", pathname === item.href && "bg-muted/50")}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
