import connectToDatabase from "@/lib/mongodb"
import { NextResponse } from "next/server"
import mongoose from "mongoose"
import EventModel from "@/models/Event"
import SourceModel from "@/models/Source"

export async function GET() {
  try {
    // Tenta di connettersi al database
    const conn = await connectToDatabase()

    if (!conn) {
      return NextResponse.json({
        success: false,
        message: "Connessione al database non disponibile",
        mongodbUri: process.env.MONGODB_URI ? "Configurato" : "Non configurato",
      })
    }

    // Verifica lo stato della connessione
    const isConnected = mongoose.connection.readyState === 1

    // Conta i documenti nelle collezioni
    const eventsCount = await EventModel.countDocuments()
    const sourcesCount = await SourceModel.countDocuments()

    // Ottieni informazioni sul database
    const dbStats = isConnected
      ? {
          name: mongoose.connection.db.databaseName,
          collections: {
            events: eventsCount,
            sources: sourcesCount,
          },
          connectionState: mongoose.connection.readyState,
        }
      : null

    return NextResponse.json({
      success: true,
      mongodb: {
        connected: isConnected,
        database: dbStats,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Errore durante la verifica del database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Errore durante la verifica del database",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
