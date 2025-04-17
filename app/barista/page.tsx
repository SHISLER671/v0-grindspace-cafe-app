"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

// Message type definition
type Message = {
  role: "user" | "assistant"
  content: string
}

// Initial conversation
const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Welcome to the café! I'm Beanjahmon — your AI barista. Ask me about roasts, brewing, or the Abstract Chain.",
  },
  {
    role: "user",
    content: "What's the best roast for iced coffee?",
  },
  {
    role: "assistant",
    content:
      "Try a washed Ethiopian with citrus notes — it shines cold. The bright acidity and floral notes really pop when chilled, creating a refreshing experience.",
  },
]

export default function BaristaPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample AI responses for demo
  const sampleResponses = [
    "For pour-over brewing, I recommend a medium-fine grind, similar to table salt. Start with a 1:16 coffee-to-water ratio and adjust to taste.",
    "The Abstract Chain is a Layer 2 solution designed for decentralized applications with a focus on scalability and low transaction fees.",
    "A light roast will preserve more of the bean's original characteristics and acidity, while a dark roast brings out more body and sweetness with less acidity.",
    "Cold brew should steep for 12-24 hours in the refrigerator. The longer it steeps, the stronger the concentrate will be.",
    "Single-origin coffees showcase the unique characteristics of a specific region, while blends combine beans from different regions for a balanced flavor profile.",
  ]

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI typing
    setIsTyping(true)

    // Simulate delay for AI response
    setTimeout(() => {
      // Get random sample response
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]

      // Add AI response
      const aiMessage: Message = {
        role: "assistant",
        content: randomResponse,
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500) // 1.5 second delay

    // TODO: Connect OpenAI API using fetch or openai SDK
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ messages: [...messages, userMessage] })
    // });
    // const data = await response.json();
    // setMessages((prev) => [...prev, data.message]);
    // setIsTyping(false);
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <Card className="flex h-[80vh] flex-col border-muted/30 bg-background/95 backdrop-blur">
        <CardHeader className="border-b border-muted/20 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarImage src="/hamster-barista.png" alt="Beanjahmon" />
              <AvatarFallback className="bg-primary/10 text-primary">☕</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">
              Ask Beanjahmon <span className="text-primary">☕</span>
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary/10 text-foreground" : "bg-muted/30 text-foreground"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mb-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">☕</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-primary">Beanjahmon</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-muted/30 p-3 text-foreground">
                  <div className="mb-1 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">☕</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-primary">Beanjahmon</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                    <div
                      className="h-2 w-2 animate-pulse rounded-full bg-primary"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-pulse rounded-full bg-primary"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <CardFooter className="border-t border-muted/20 p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about coffee, brewing, or the Abstract Chain..."
              className="min-h-[50px] flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
