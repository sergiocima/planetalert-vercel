import { getRelatedSources, createSource } from "@/lib/events"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sources = await getRelatedSources(params.id)
    return NextResponse.json(sources)
  } catch (error) {
    console.error(`Errore durante il recupero delle fonti per l'evento ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Errore durante il recupero delle fonti", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sourceData = await request.json()
    // Assicuriamoci che l'eventId sia quello dell'URL
    sourceData.eventId = params.id

    const sourceId = await createSource(sourceData)
    return NextResponse.json({ success: true, sourceId }, { status: 201 })
  } catch (error) {
    console.error(`Errore durante la creazione della fonte per l'evento ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Errore durante la creazione della fonte", error: String(error) },
      { status: 500 },
    )
  }
}
