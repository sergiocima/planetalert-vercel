import connectToDatabase from "@/lib/mongodb"
import { NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET() {
  try {
    console.log("Verifica stato connessione MongoDB Serverless...")

    // Tenta di connettersi al database
    const startTime = Date.now()
    const conn = await connectToDatabase()
    const connectionTime = Date.now() - startTime

    // Verifica lo stato della connessione
    const isConnected = mongoose.connection.readyState === 1

    if (!conn) {
      return NextResponse.json({
        success: false,
        message: "Connessione al database non disponibile",
        mongodbUri: process.env.MONGODB_URI ? "Configurato" : "Non configurato",
        connectionAttemptTime: `${connectionTime}ms`,
      })
    }

    // Esegui una semplice query per verificare che il database funzioni
    let queryTime = 0
    let querySuccess = false

    try {
      const startQueryTime = Date.now()
      // Esegui una semplice query sul database admin
      await mongoose.connection.db.admin().ping()
      queryTime = Date.now() - startQueryTime
      querySuccess = true
    } catch (queryError) {
      console.error("Errore durante la query di test:", queryError)
      querySuccess = false
    }

    return NextResponse.json({
      success: true,
      message: "Connessione MongoDB Serverless attiva",
      status: {
        connected: isConnected,
        readyState: mongoose.connection.readyState,
        connectionTime: `${connectionTime}ms`,
        querySuccess,
        queryTime: querySuccess ? `${queryTime}ms` : "N/A",
      },
      database: {
        name: mongoose.connection.db.databaseName,
        host: mongoose.connection.host,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Errore durante la verifica dello stato:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Errore durante la connessione al database",
        error: String(error),
        errorType: error.name || "Unknown",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
