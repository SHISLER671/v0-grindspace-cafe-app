// ERC20 Token Address for $GRIND ($GMT) on Abstract Testnet
export const GRIND_TOKEN_ADDRESS = "0xd02eFEc1319E3920aBE0ffce53644Bb5677e1999"

// Mock farmer addresses - in production these would come from a database
export const FARMER_ADDRESSES = {
  "Maria – Honduras": "0x1234567890123456789012345678901234567890",
  "Pablo – Peru": "0x2345678901234567890123456789012345678901",
  "Kofi – Ghana": "0x3456789012345678901234567890123456789012",
}

// ERC20 ABI - minimal version for our needs
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
]
