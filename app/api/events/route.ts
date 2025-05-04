import { getEvents, createEvent } from "@/lib/events"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const events = await getEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error("Errore durante il recupero degli eventi:", error)
    return NextResponse.json(
      { success: false, message: "Errore durante il recupero degli eventi", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()
    const eventId = await createEvent(eventData)
    return NextResponse.json({ success: true, eventId }, { status: 201 })
  } catch (error) {
    console.error("Errore durante la creazione dell'evento:", error)
    return NextResponse.json(
      { success: false, message: "Errore durante la creazione dell'evento", error: String(error) },
      { status: 500 },
    )
  }
}
