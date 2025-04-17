"use client"

import { AbstractWalletProvider } from "@abstract-foundation/agw-react"
import { WagmiConfig, createConfig } from "wagmi"
import { http } from "wagmi"
import type { ReactNode } from "react"

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

// Set up wagmi config with direct HTTP provider
const config = createConfig({
  chains: [abstractTestnet],
  transports: {
    [abstractTestnet.id]: http("https://api.testnet.abs.xyz"),
  },
})

export function AGWProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <AbstractWalletProvider chain={abstractTestnet}>{children}</AbstractWalletProvider>
    </WagmiConfig>
  )
}
