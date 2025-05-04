import { seedDatabase } from "@/lib/events"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await seedDatabase()
    return NextResponse.json({
      success: true,
      message: result.message,
      stats: result.stats,
    })
  } catch (error) {
    console.error("Errore durante l'inizializzazione del database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Errore durante l'inizializzazione del database",
        error: String(error),
        errorType: error.name || "Unknown",
      },
      { status: 500 },
    )
  }
}
