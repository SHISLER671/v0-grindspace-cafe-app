import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Coffee } from "lucide-react"

export function BeanjahmonFallback() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-foreground font-sans p-4">
      <Avatar className="h-24 w-24 rounded-md border-2 border-primary/50 mb-6">
        <AvatarImage src="/beanjahmon-avatar.png" alt="Beanjahmon" className="object-cover" />
        <AvatarFallback className="bg-secondary text-primary text-3xl">BJ</AvatarFallback>
      </Avatar>

      <h1 className="text-3xl font-bold text-primary mb-2 font-heading shadow-rainbow">Beanjahmon</h1>
      <p className="text-lg text-muted-foreground mb-8">Your irie uncle who knows almost everything about coffee</p>

      <div className="max-w-md bg-secondary rounded-lg p-6 border border-primary/20 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Coffee className="h-6 w-6 text-primary" />
          <h2 className="text-xl text-primary font-heading">Temporarily Unavailable</h2>
        </div>
        <p className="text-foreground mb-4">
          *adjusts beanie* Hey there, cosmic traveler. I'm taking a little coffee break right now. The beans need time
          to speak to me, y'know?
        </p>
        <p className="text-muted-foreground text-sm">
          (OpenAI API key has exceeded its quota or has billing issues. Please check your plan and billing details.)
        </p>
      </div>
    </div>
  )
}
