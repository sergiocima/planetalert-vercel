import { seedDatabase } from "@/lib/events"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await seedDatabase()
    return NextResponse.json({ success: true, message: "Database inizializzato con successo" })
  } catch (error) {
    console.error("Errore durante l'inizializzazione del database:", error)
    return NextResponse.json(
      { success: false, message: "Errore durante l'inizializzazione del database", error: String(error) },
      { status: 500 },
    )
  }
}
