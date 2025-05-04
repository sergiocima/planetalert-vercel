import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null }

if (!(global as any).mongoose) {
  ;(global as any).mongoose = cached
}

async function connectToDatabase() {
  // Se siamo in fase di build e non è richiesto esplicitamente, non connettersi al database
  if (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === "production" &&
    !process.env.NEXT_PUBLIC_RUNTIME
  ) {
    console.log("Build in produzione, salto la connessione al database")
    return null
  }

  // Se non c'è un URI MongoDB configurato, restituisci null
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI non configurato. Funzionalità database disabilitate.")
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    // Opzioni ottimizzate per MongoDB Atlas Serverless
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      // Opzioni specifiche per Serverless
      autoIndex: false, // Non creare indici automaticamente in produzione
      maxPoolSize: 10, // Limita il numero di connessioni
      minPoolSize: 1, // Mantieni almeno una connessione attiva
      connectTimeoutMS: 10000, // Timeout di connessione
      socketTimeoutMS: 45000, // Timeout socket
    }

    console.log("Tentativo di connessione a MongoDB Serverless...")

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB Serverless connesso con successo")
        return mongoose
      })
      .catch((error) => {
        console.error("Errore di connessione a MongoDB Serverless:", error)

        // Log dettagliato dell'errore
        if (error.name === "MongoServerSelectionError") {
          console.error("Impossibile selezionare un server MongoDB. Verifica:")
          console.error("1. Che l'indirizzo IP sia nella whitelist")
          console.error("2. Che le credenziali siano corrette")
          console.error("3. Che il cluster sia attivo e raggiungibile")
        }

        cached.promise = null
        return null
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    console.error("Errore durante l'attesa della connessione:", e)
    cached.promise = null
    return null
  }

  return cached.conn
}

export default connectToDatabase
