"use client"

import { AbstractWalletProvider } from "@abstract-foundation/agw-react"
import { WagmiConfig, createConfig } from "wagmi"
import { http } from "wagmi"
import { type ReactNode, useEffect } from "react"

const abstractTestnet = {
  id: 11124,
  name: "Abstract Testnet",
  network: "abstract-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Abstract",
    symbol: "ABS",
  },
  rpcUrls: {
    public: { http: ["https://api.testnet.abs.xyz"] },
    default: { http: ["https://api.testnet.abs.xyz"] },
  },
}

// Safe localStorage functions that check for browser environment
const safeStorage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null
    try {
      const value = localStorage.getItem(key)
      return value === null ? null : JSON.parse(value)
    } catch (error) {
      console.error("Error retrieving from localStorage:", error)
      return null
    }
  },
  setItem: (key: string, value: unknown) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error storing in localStorage:", error)
    }
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },
}

// Set up wagmi config with direct HTTP provider and persistent storage
const config = createConfig({
  chains: [abstractTestnet],
  transports: {
    [abstractTestnet.id]: http("https://api.testnet.abs.xyz"),
  },
  // Enable persistent storage for wallet connections
  // This ensures the connection persists across page refreshes
  storage: safeStorage,
})

export function AGWProvider({ children }: { children: ReactNode }) {
  // Attempt to reconnect on page load if previously connected
  useEffect(() => {
    // Check if there's a stored connection
    const storedConnection = typeof window !== "undefined" ? localStorage.getItem("agw-connection") : null
    if (storedConnection) {
      // The Abstract wallet will automatically attempt to reconnect
      console.log("Attempting to reconnect to previously connected wallet")
    }
  }, [])

  return (
    <WagmiConfig config={config}>
      <AbstractWalletProvider
        chain={abstractTestnet}
        // Set persistent session to true
        persistSession={true}
        // Auto-connect if previously connected
        autoConnect={true}
      >
        {children}
      </AbstractWalletProvider>
    </WagmiConfig>
  )
}
