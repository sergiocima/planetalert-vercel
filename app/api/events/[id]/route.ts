import { getEventById, updateEvent, deleteEvent } from "@/lib/events"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = await getEventById(params.id)

    if (!event) {
      return NextResponse.json({ success: false, message: "Evento non trovato" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error(`Errore durante il recupero dell'evento ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Errore durante il recupero dell'evento", error: String(error) },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventData = await request.json()
    const success = await updateEvent(params.id, eventData)

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Evento non trovato o nessuna modifica effettuata" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Errore durante l'aggiornamento dell'evento ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Errore durante l'aggiornamento dell'evento", error: String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteEvent(params.id)

    if (!success) {
      return NextResponse.json({ success: false, message: "Evento non trovato" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Errore durante l'eliminazione dell'evento ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Errore durante l'eliminazione dell'evento", error: String(error) },
      { status: 500 },
    )
  }
}
