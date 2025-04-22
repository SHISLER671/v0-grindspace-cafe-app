"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coffee, Trophy, Users } from "lucide-react"

// Mock data for leaderboards
// TODO: Replace with data from smart contract or server fetch
const topReferrers = [
  { address: "0x1234…abcd", value: "300 $GRIND" },
  { address: "0x5678…efgh", value: "210 $GRIND" },
  { address: "0x9abc…def0", value: "150 $GRIND" },
  { address: "0x2468…1357", value: "120 $GRIND" },
  { address: "0x1357…2468", value: "90 $GRIND" },
]

const topTippers = [
  { address: "0xa1b2…c3d4", value: "7 tips" },
  { address: "0xe5f6…7890", value: "6 tips" },
  { address: "0xdead…beef", value: "5 tips" },
  { address: "0xcafe…babe", value: "4 tips" },
  { address: "0xf00d…cafe", value: "3 tips" },
]

// Helper function to get rank emoji
const getRankBadge = (index: number) => {
  switch (index) {
    case 0:
      return { emoji: "🥇", color: "bg-primary/10 text-primary hover:bg-primary/20" }
    case 1:
      return { emoji: "🥈", color: "bg-muted/10 text-muted-foreground hover:bg-muted/20" }
    case 2:
      return { emoji: "🥉", color: "bg-rainbow-yellow/10 text-rainbow-yellow hover:bg-rainbow-yellow/20" }
    default:
      return { emoji: `${index + 1}`, color: "bg-muted/20 text-muted-foreground hover:bg-muted/30" }
  }
}

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight font-heading">Leaderboard</h1>
      </div>

      <div className="rainbow-divider"></div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Referrers Card */}
        <Card className="mc-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="font-heading">Top Referrers</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Users who have referred the most friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topReferrers.map((referrer, index) => {
                const { emoji, color } = getRankBadge(index)
                return (
                  <li
                    key={referrer.address}
                    className="flex items-center justify-between rounded-lg border border-muted/20 p-3 transition-all hover:bg-muted/5"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`h-7 w-7 justify-center rounded-full ${color}`}>
                        {emoji}
                      </Badge>
                      <span className="font-medium">{referrer.address}</span>
                    </div>
                    <span className="font-semibold text-primary">{referrer.value}</span>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Top Tippers Card */}
        <Card className="mc-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-primary" />
              <CardTitle className="font-heading">Top Tippers</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">Users who have tipped the most farmers</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topTippers.map((tipper, index) => {
                const { emoji, color } = getRankBadge(index)
                return (
                  <li
                    key={tipper.address}
                    className="flex items-center justify-between rounded-lg border border-muted/20 p-3 transition-all hover:bg-muted/5"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`h-7 w-7 justify-center rounded-full ${color}`}>
                        {emoji}
                      </Badge>
                      <span className="font-medium">{tipper.address}</span>
                    </div>
                    <span className="font-semibold text-primary">{tipper.value}</span>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
