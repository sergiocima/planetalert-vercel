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
    const sourceId = await createSource(sourceData)
    return NextResponse.json({ success: true, sourceId }, { status: 201 })
  } catch (error) {
    console.error("Errore durante la creazione della fonte:", error)
    return NextResponse.json(
      { success: false, message: "Errore durante la creazione della fonte", error: String(error) },
      { status: 500 },
    )
  }
}
