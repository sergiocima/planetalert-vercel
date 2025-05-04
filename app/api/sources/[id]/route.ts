import { deleteSource } from "@/lib/events"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteSource(params.id)

    if (!success) {
      return NextResponse.json({ success: false, message: "Fonte non trovata" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Errore durante l'eliminazione della fonte ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Errore durante l'eliminazione della fonte", error: String(error) },
      { status: 500 },
    )
  }
}
