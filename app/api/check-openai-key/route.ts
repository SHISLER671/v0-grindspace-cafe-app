import { NextResponse } from "next/server"

export async function GET() {
  const hasOpenAIKey = process.env.OPENAI_API_KEY ? true : false

  // We can only check if the key exists here, not if it has exceeded quota
  // The actual quota check will happen in the client component

  return NextResponse.json({
    hasOpenAIKey,
    message: hasOpenAIKey ? "API key found" : "API key missing",
  })
}
