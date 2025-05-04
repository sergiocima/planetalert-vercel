import connectToDatabase from "@/lib/mongodb"
import { NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET() {
  try {
    // Tenta di connettersi al database
    await connectToDatabase()

    // Verifica lo stato della connessione
    const isConnected = mongoose.connection.readyState === 1

    // Ottieni informazioni sul database
    const dbStats = isConnected
      ? {
          name: mongoose.connection.db.databaseName,
          collections: await mongoose.connection.db
            .listCollections()
            .toArray()
            .then((cols) => cols.length),
        }
      : null

    return NextResponse.json({
      status: "success",
      mongodb: {
        connected: isConnected,
        database: dbStats,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Errore durante la verifica dello stato:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Errore durante la connessione al database",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
