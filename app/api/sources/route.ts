import { getAllSources, createSource } from "@/lib/events"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const sources = await getAllSources()
    return NextResponse.json(sources)
  } catch (error) {
    console.error("Errore durante il recupero delle fonti:", error)
    return NextResponse.json(
      { success: false, message: "Errore durante il recupero delle fonti", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sourceData = await request.json()

    // Aggiungiamo log per debug
    console.log("Dati ricevuti per la creazione della fonte:", sourceData)

    // Verifichiamo che l'eventId sia presente e valido
    if (!sourceData.eventId) {
      return NextResponse.json({ success: false, message: "eventId mancante o non valido" }, { status: 400 })
    }

    const sourceId = await createSource(sourceData)

    // Log di conferma
    console.log("Fonte creata con successo, ID:", sourceId)

    return NextResponse.json({ success: true, sourceId }, { status: 201 })
  } catch (error) {
    console.error("Errore durante la creazione della fonte:", error)
    return NextResponse.json(
      { success: false, message: "Errore durante la creazione della fonte", error: String(error) },
      { status: 500 },
    )
  }
}
