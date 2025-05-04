import { getRelatedSources, createSource } from "@/lib/events"
import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

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
    // Verifica che l'ID dell'evento sia valido
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, message: "ID evento non valido" }, { status: 400 })
    }

    const sourceData = await request.json()

    // Assicuriamoci che l'eventId sia quello dell'URL
    sourceData.eventId = params.id

    console.log(`Tentativo di creazione fonte per l'evento ${params.id}:`, sourceData)

    const sourceId = await createSource(sourceData)

    console.log(`Fonte creata con successo per l'evento ${params.id}, ID:`, sourceId)

    return NextResponse.json({ success: true, sourceId }, { status: 201 })
  } catch (error) {
    console.error(`Errore durante la creazione della fonte per l'evento ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Errore durante la creazione della fonte", error: String(error) },
      { status: 500 },
    )
  }
}
