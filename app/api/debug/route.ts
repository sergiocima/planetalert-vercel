import { NextResponse } from "next/server"

export async function GET() {
  // Restituisci solo le variabili d'ambiente pubbliche (NEXT_PUBLIC_*)
  const publicEnvVars: Record<string, string> = {}

  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("NEXT_PUBLIC_")) {
      publicEnvVars[key] = process.env[key] || ""
    }
  })

  // Aggiungi informazioni sulla versione di Node.js e Next.js
  const nodeVersion = process.version
  const nextVersion = process.env.NEXT_VERSION || "unknown"

  return NextResponse.json({
    env: publicEnvVars,
    nodeVersion,
    nextVersion,
    timestamp: new Date().toISOString(),
  })
}
