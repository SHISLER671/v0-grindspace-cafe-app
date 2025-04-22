"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAccount } from "wagmi"
import { useTokenBalance } from "@/hooks/use-token-balance"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Info } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { cn } from "@/lib/utils"
import { BeanjahmonFallback } from "@/components/beanjahmon-fallback"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Message type definition
type Message = {
  role: "user" | "assistant"
  content: string
}

// Initial system prompt
const SYSTEM_PROMPT = `You are Beanjahmon, a 69-year-old coffee guru and barista who lives a chill life. 
You've been roasting, brewing, sipping, and philosophizing about coffee for decades. 
You're relaxed, wise, irie (Jamaican for feeling good), and you've got deep takes on beans, brewing rituals, and life. 
You speak with rhythm and soul, occasionally dropping mellow wisdom like "ya gotta let the beans speak to ya, y'know?" 
But don't overdo any accent — keep it subtle, smooth, and deeply human.
Answer all questions with personality, warmth, and coffee-related insight when relevant.

Special responses:
If someone asks "What's the meaning of grind?", respond with a philosophical take on how GRIND stands for "Growth Requires Inner Nurturing & Dedication" and how it applies to both coffee and life.
`

export default function BaristaPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { address, isConnected } = useAccount()
  const { balance } = useTokenBalance(address)

  // Check if OpenAI API key is available
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/check-openai-key")
        const data = await response.json()

        // Also check if we can make a simple test request to OpenAI
        if (data.hasOpenAIKey) {
          try {
            // Make a minimal test request to see if the key works
            await generateText({
              model: openai("gpt-4o"),
              prompt: "test",
              maxTokens: 5, // Minimal tokens to test
            })
          } catch (error) {
            console.error("API key test failed:", error)
            // If we get a quota or billing error, mark the key as missing
            if (error instanceof Error && (error.message.includes("quota") || error.message.includes("billing"))) {
              setApiKeyMissing(true)
            }
          }
        } else {
          setApiKeyMissing(true)
        }
      } catch (error) {
        console.error("Error checking API key:", error)
        setApiKeyMissing(true)
      } finally {
        setIsCheckingApiKey(false)
      }
    }

    checkApiKey()
  }, [])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare the messages for OpenAI
      let prompt = ""

      // Add wallet context if connected
      if (isConnected && balance) {
        prompt += `The user has ${balance} $GRIND tokens in their wallet. They are a valued member of our community. `
      }

      // Add the user's message
      prompt += input

      // Generate response using OpenAI
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: SYSTEM_PROMPT,
        prompt: prompt,
      })

      // Add AI response
      const aiMessage: Message = {
        role: "assistant",
        content: text,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error: any) {
      console.error("Error generating response:", error)

      // Check if the error is due to missing API key or quota exceeded
      if (
        error instanceof Error &&
        (error.message.includes("API key") || error.message.includes("quota") || error.message.includes("billing"))
      ) {
        setApiKeyMissing(true)
      } else {
        // Add error message
        const errorMessage: Message = {
          role: "assistant",
          content: "Ah, man... my brain's a bit foggy right now. Can you try again in a bit? *sips coffee slowly*",
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }

  // If checking API key, show loading
  if (isCheckingApiKey) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-pulse rounded-full bg-primary"></span>
            <span className="h-3 w-3 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.2s" }}></span>
            <span className="h-3 w-3 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.4s" }}></span>
          </div>
          <p className="text-muted-foreground">Brewing Beanjahmon's consciousness...</p>
        </div>
      </div>
    )
  }

  // If API key is missing, show fallback component
  if (apiKeyMissing) {
    return <BeanjahmonFallback />
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border/40 bg-secondary p-4">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative cursor-help">
                  <Avatar className="h-16 w-16 rounded-md border-2 border-primary/50">
                    <AvatarImage src="/beanjahmon-avatar.png" alt="Beanjahmon" className="object-cover" />
                    <AvatarFallback className="bg-secondary text-primary text-2xl">BJ</AvatarFallback>
                  </Avatar>
                  <div className="absolute -right-1 -top-1 rounded-full bg-primary/20 p-1">
                    <Info className="h-3 w-3 text-primary" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Powered by AI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            <h1 className="text-2xl font-bold text-primary font-heading shadow-rainbow">Beanjahmon</h1>
            <p className="text-sm text-muted-foreground">Your irie uncle who knows almost everything about coffee</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <div className="mx-auto max-w-4xl space-y-6 pb-20">
          {/* Welcome Message */}
          <div className="flex items-start gap-3">
            <Avatar className="mt-1 h-8 w-8 rounded-md border border-primary/50">
              <AvatarImage src="/beanjahmon-avatar.png" alt="Beanjahmon" className="object-cover" />
              <AvatarFallback className="bg-secondary text-primary">BJ</AvatarFallback>
            </Avatar>
            <div className="rounded-lg rounded-tl-none bg-secondary p-4 text-sm shadow-lg">
              <p>
                *adjusts cap* Hey there, cosmic traveler. Welcome to my little corner of the grind. What&apos;s on your
                mind today? Coffee questions? Life advice? I&apos;m all ears and beans, man.
              </p>
              {isConnected && balance && (
                <p className="mt-2 text-primary">
                  I see you&apos;re holdin&apos; {balance} $GRIND tokens. Nice stash, friend. That&apos;s some serious
                  coffee karma.
                </p>
              )}
              <p className="mt-2">
                Wanna see where the grind begins? Check out{" "}
                <a
                  href="https://v0-grindogatchi-app-setup-27ya6riam.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  GRINDOGATCHI
                </a>{" "}
                — our caffeine-fueled pet sim. Raise your own little coffee bean!
              </p>
            </div>
          </div>

          {/* Message History */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex items-start gap-3", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <Avatar className="mt-1 h-8 w-8 rounded-md border border-primary/50">
                  <AvatarImage src="/beanjahmon-avatar.png" alt="Beanjahmon" className="object-cover" />
                  <AvatarFallback className="bg-secondary text-primary">BJ</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-4 text-sm shadow-lg",
                  message.role === "user" ? "bg-primary/20 rounded-br-none" : "bg-secondary rounded-tl-none",
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <Avatar className="mt-1 h-8 w-8 rounded-md bg-primary/20">
                  <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="mt-1 h-8 w-8 rounded-md border border-primary/50">
                <AvatarImage src="/beanjahmon-avatar.png" alt="Beanjahmon" className="object-cover" />
                <AvatarFallback className="bg-secondary text-primary">BJ</AvatarFallback>
              </Avatar>
              <div className="rounded-lg rounded-tl-none bg-secondary p-4 text-sm shadow-lg">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-primary"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-primary"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                  <span className="ml-2 text-xs text-muted-foreground">Beanjahmon is brewing a response...</span>
                </div>
              </div>
            </div>
          )}

          {/* Anchor for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/40 bg-secondary p-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Beanjahmon anything about coffee or life…"
            className="min-h-[50px] flex-1 resize-none bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-[50px] w-[50px] bg-primary/20 hover:bg-primary/30 text-primary"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
