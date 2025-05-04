import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/natural-events"

// Variabile per memorizzare la connessione
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout dopo 5 secondi
      maxPoolSize: 10, // Mantieni fino a 10 connessioni socket
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connesso con successo")
        return mongoose
      })
      .catch((error) => {
        console.error("Errore di connessione a MongoDB:", error)
        cached.promise = null
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Gestione degli eventi di connessione
mongoose.connection.on("connected", () => {
  console.log("MongoDB connesso")
})

mongoose.connection.on("error", (err) => {
  console.error("Errore MongoDB:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnesso")
})

// Gestione della chiusura dell'applicazione
process.on("SIGINT", async () => {
  await mongoose.connection.close()
  process.exit(0)
})

export default connectToDatabase
