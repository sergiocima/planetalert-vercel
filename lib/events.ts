import connectToDatabase from "./mongodb"
import EventModel, { type IEvent } from "../models/Event"
import SourceModel, { type ISource } from "../models/Source"
import mongoose from "mongoose"
import type { Event } from "@/types/event"
import type { Source } from "@/types/source"

// Dati di fallback per quando il database non è disponibile
const fallbackEvents: Event[] = [
  {
    id: "1",
    title: "Alluvione in Emilia-Romagna",
    type: "alluvione",
    location: "Emilia-Romagna, Italia",
    latitude: 44.4949,
    longitude: 11.3426,
    date: "2023-05-16T00:00:00.000Z",
    description:
      "Grave alluvione che ha colpito diverse province dell'Emilia-Romagna, causando esondazioni di fiumi, frane e allagamenti.",
    scientificAnalysis:
      "L'evento è stato causato da precipitazioni eccezionali, con accumuli che hanno superato i 200mm in 36 ore.",
    severity: 5,
    status: "Concluso",
    affectedArea: 23000,
    casualties: 17,
    economicDamage: "8,5 miliardi €",
  },
  {
    id: "2",
    title: "Terremoto di Amatrice",
    type: "terremoto",
    location: "Amatrice, Lazio, Italia",
    latitude: 42.6271,
    longitude: 13.2888,
    date: "2016-08-24T01:36:00.000Z",
    description: "Forte terremoto di magnitudo 6.0 che ha colpito l'Italia centrale, con epicentro vicino ad Amatrice.",
    scientificAnalysis:
      "Il terremoto è stato generato da una faglia normale con direzione NW-SE, tipica dell'Appennino centrale.",
    severity: 5,
    status: "Concluso",
    affectedArea: 8000,
    casualties: 299,
    economicDamage: "23,5 miliardi €",
  },
]

const fallbackSources: Source[] = [
  {
    id: "1",
    eventId: "1",
    title: "Rapporto tecnico sull'alluvione in Emilia-Romagna",
    author: "ISPRA - Istituto Superiore per la Protezione e la Ricerca Ambientale",
    type: "article",
    url: "https://example.com/ispra-report",
    date: "2023-06-10T00:00:00.000Z",
  },
  {
    id: "2",
    eventId: "1",
    title: "Analisi idrologica degli eventi di maggio 2023",
    author: "Università di Bologna - Dipartimento di Ingegneria Civile",
    type: "article",
    url: "https://example.com/unibo-report",
    date: "2023-07-05T00:00:00.000Z",
  },
]

// Funzione per convertire il documento MongoDB in un oggetto Event
function mapEventDocument(doc: IEvent): Event {
  return {
    id: doc._id.toString(),
    title: doc.title,
    type: doc.type,
    location: doc.location,
    latitude: doc.latitude,
    longitude: doc.longitude,
    date: doc.date.toISOString(),
    description: doc.description,
    scientificAnalysis: doc.scientificAnalysis,
    severity: doc.severity,
    status: doc.status,
    affectedArea: doc.affectedArea,
    casualties: doc.casualties,
    economicDamage: doc.economicDamage,
  }
}

// Funzione per convertire il documento MongoDB in un oggetto Source
function mapSourceDocument(doc: ISource): Source {
  return {
    id: doc._id.toString(),
    eventId: doc.eventId.toString(),
    title: doc.title,
    author: doc.author,
    type: doc.type,
    url: doc.url,
    date: doc.date.toISOString(),
  }
}

// Funzioni per interagire con i dati
// Modifichiamo la funzione getEvents per gestire meglio gli errori durante il build
export async function getEvents(): Promise<Event[]> {
  // Durante il build in produzione, restituisci i dati di fallback
  if (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === "production" &&
    !process.env.NEXT_PUBLIC_RUNTIME
  ) {
    console.log("Build in produzione, utilizzo dati di fallback")
    return fallbackEvents
  }

  try {
    const conn = await connectToDatabase()
    if (!conn) {
      console.warn("Connessione al database non disponibile, utilizzo dati di fallback")
      return fallbackEvents
    }

    const events = await EventModel.find().sort({ date: -1 })
    return events.map(mapEventDocument)
  } catch (error) {
    console.error("Errore durante il recupero degli eventi:", error)
    return fallbackEvents
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  // Durante il build in produzione, restituisci i dati di fallback
  if (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === "production" &&
    !process.env.NEXT_PUBLIC_RUNTIME
  ) {
    console.log("Build in produzione, utilizzo dati di fallback")
    return fallbackEvents.find((e) => e.id === id) || null
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null
    }

    const conn = await connectToDatabase()
    if (!conn) {
      console.warn("Connessione al database non disponibile, utilizzo dati di fallback")
      return fallbackEvents.find((e) => e.id === id) || null
    }

    const event = await EventModel.findById(id)

    if (!event) {
      return null
    }

    return mapEventDocument(event)
  } catch (error) {
    console.error(`Errore durante il recupero dell'evento ${id}:`, error)
    return fallbackEvents.find((e) => e.id === id) || null
  }
}

export async function getRelatedSources(eventId: string): Promise<Source[]> {
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return []
    }

    const conn = await connectToDatabase()
    if (!conn) {
      console.warn("Connessione al database non disponibile, utilizzo dati di fallback")
      return fallbackSources.filter((s) => s.eventId === eventId)
    }

    const sources = await SourceModel.find({ eventId }).sort({ date: -1 })
    return sources.map(mapSourceDocument)
  } catch (error) {
    console.error(`Errore durante il recupero delle fonti per l'evento ${eventId}:`, error)
    return fallbackSources.filter((s) => s.eventId === eventId)
  }
}

export async function createEvent(eventData: Omit<Event, "id">): Promise<string> {
  try {
    const conn = await connectToDatabase()
    if (!conn) {
      throw new Error("Connessione al database non disponibile")
    }

    const newEvent = new EventModel({
      ...eventData,
      date: new Date(eventData.date),
    })

    const savedEvent = await newEvent.save()
    return savedEvent._id.toString()
  } catch (error) {
    console.error("Errore durante la creazione dell'evento:", error)
    throw error
  }
}

export async function getAllSources(): Promise<Source[]> {
  try {
    const conn = await connectToDatabase()
    if (!conn) {
      console.warn("Connessione al database non disponibile, utilizzo dati di fallback")
      return fallbackSources
    }

    const sources = await SourceModel.find().sort({ date: -1 })
    return sources.map(mapSourceDocument)
  } catch (error) {
    console.error("Errore durante il recupero delle fonti:", error)
    return fallbackSources
  }
}

export async function createSource(sourceData: Omit<Source, "id">): Promise<string> {
  try {
    const conn = await connectToDatabase()
    if (!conn) {
      throw new Error("Connessione al database non disponibile")
    }

    if (!mongoose.Types.ObjectId.isValid(sourceData.eventId)) {
      throw new Error("ID evento non valido")
    }

    const newSource = new SourceModel({
      ...sourceData,
      eventId: new mongoose.Types.ObjectId(sourceData.eventId),
      date: new Date(sourceData.date),
    })

    const savedSource = await newSource.save()
    return savedSource._id.toString()
  } catch (error) {
    console.error("Errore durante la creazione della fonte:", error)
    throw error
  }
}

export async function updateEvent(id: string, eventData: Omit<Event, "id">): Promise<boolean> {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false
    }

    const conn = await connectToDatabase()
    if (!conn) {
      throw new Error("Connessione al database non disponibile")
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      {
        ...eventData,
        date: new Date(eventData.date),
      },
      { new: true }, // Restituisce il documento modificato
    )

    return !!updatedEvent // Restituisce true se l'evento è stato trovato e aggiornato
  } catch (error) {
    console.error(`Errore durante l'aggiornamento dell'evento ${id}:`, error)
    return false
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false
    }

    const conn = await connectToDatabase()
    if (!conn) {
      throw new Error("Connessione al database non disponibile")
    }

    const deletedEvent = await EventModel.findByIdAndDelete(id)
    return !!deletedEvent // Restituisce true se l'evento è stato trovato ed eliminato
  } catch (error) {
    console.error(`Errore durante l'eliminazione dell'evento ${id}:`, error)
    return false
  }
}

export async function deleteSource(id: string): Promise<boolean> {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false
    }

    const conn = await connectToDatabase()
    if (!conn) {
      throw new Error("Connessione al database non disponibile")
    }

    const deletedSource = await SourceModel.findByIdAndDelete(id)
    return !!deletedSource // Restituisce true se la fonte è stata trovata ed eliminata
  } catch (error) {
    console.error(`Errore durante l'eliminazione della fonte ${id}:`, error)
    return false
  }
}

export async function seedDatabase() {
  try {
    const conn = await connectToDatabase()
    if (!conn) {
      throw new Error("Connessione al database non disponibile")
    }

    // Pulisci le collezioni esistenti
    await EventModel.deleteMany({})
    await SourceModel.deleteMany({})

    // Crea eventi di esempio
    const event1 = new EventModel({
      title: "Alluvione in Emilia-Romagna",
      type: "alluvione",
      location: "Emilia-Romagna, Italia",
      latitude: 44.4949,
      longitude: 11.3426,
      date: new Date("2023-05-16T00:00:00.000Z"),
      description:
        "Grave alluvione che ha colpito diverse province dell'Emilia-Romagna, causando esondazioni di fiumi, frane e allagamenti.",
      scientificAnalysis:
        "L'evento è stato causato da precipitazioni eccezionali, con accumuli che hanno superato i 200mm in 36 ore.",
      severity: 5,
      status: "Concluso",
      affectedArea: 23000,
      casualties: 17,
      economicDamage: "8,5 miliardi €",
    })
    await event1.save()

    const event2 = new EventModel({
      title: "Terremoto di Amatrice",
      type: "terremoto",
      location: "Amatrice, Lazio, Italia",
      latitude: 42.6271,
      longitude: 13.2888,
      date: new Date("2016-08-24T01:36:00.000Z"),
      description:
        "Forte terremoto di magnitudo 6.0 che ha colpito l'Italia centrale, con epicentro vicino ad Amatrice.",
      scientificAnalysis:
        "Il terremoto è stato generato da una faglia normale con direzione NW-SE, tipica dell'Appennino centrale.",
      severity: 5,
      status: "Concluso",
      affectedArea: 8000,
      casualties: 299,
      economicDamage: "23,5 miliardi €",
    })
    await event2.save()

    // Crea fonti di esempio
    const source1 = new SourceModel({
      eventId: event1._id,
      title: "Rapporto tecnico sull'alluvione in Emilia-Romagna",
      author: "ISPRA - Istituto Superiore per la Protezione e la Ricerca Ambientale",
      type: "article",
      url: "https://example.com/ispra-report",
      date: new Date("2023-06-10T00:00:00.000Z"),
    })
    await source1.save()

    const source2 = new SourceModel({
      eventId: event1._id,
      title: "Analisi idrologica degli eventi di maggio 2023",
      author: "Università di Bologna - Dipartimento di Ingegneria Civile",
      type: "article",
      url: "https://example.com/unibo-report",
      date: new Date("2023-07-05T00:00:00.000Z"),
    })
    await source2.save()

    console.log("Database inizializzato con successo")
  } catch (error) {
    console.error("Errore durante l'inizializzazione del database:", error)
    throw error
  }
}
