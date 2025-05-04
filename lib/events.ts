import connectToDatabase from "./mongodb"
import EventModel, { type IEvent } from "../models/Event"
import SourceModel, { type ISource } from "../models/Source"
import mongoose from "mongoose"
import type { Event } from "@/types/event"
import type { Source } from "@/types/source"

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
export async function getEvents(): Promise<Event[]> {
  await connectToDatabase()
  const events = await EventModel.find().sort({ date: -1 })
  return events.map(mapEventDocument)
}

export async function getEventById(id: string): Promise<Event | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null
  }

  await connectToDatabase()
  const event = await EventModel.findById(id)

  if (!event) {
    return null
  }

  return mapEventDocument(event)
}

export async function getRelatedSources(eventId: string): Promise<Source[]> {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return []
  }

  await connectToDatabase()
  const sources = await SourceModel.find({ eventId }).sort({ date: -1 })
  return sources.map(mapSourceDocument)
}

export async function createEvent(eventData: Omit<Event, "id">): Promise<string> {
  await connectToDatabase()
  const newEvent = new EventModel({
    ...eventData,
    date: new Date(eventData.date),
  })

  const savedEvent = await newEvent.save()
  return savedEvent._id.toString()
}

export async function updateEvent(id: string, eventData: Partial<Omit<Event, "id">>): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false
  }

  await connectToDatabase()

  // Se c'è una data, convertiamola in un oggetto Date
  if (eventData.date) {
    eventData.date = new Date(eventData.date)
  }

  const result = await EventModel.updateOne({ _id: id }, { $set: eventData })
  return result.modifiedCount > 0
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false
  }

  await connectToDatabase()

  // Elimina l'evento
  const result = await EventModel.deleteOne({ _id: id })

  // Elimina anche tutte le fonti associate
  if (result.deletedCount > 0) {
    await SourceModel.deleteMany({ eventId: id })
  }

  return result.deletedCount > 0
}

export async function createSource(sourceData: Omit<Source, "id">): Promise<string> {
  await connectToDatabase()
  const newSource = new SourceModel({
    ...sourceData,
    eventId: new mongoose.Types.ObjectId(sourceData.eventId),
    date: new Date(sourceData.date),
  })

  const savedSource = await newSource.save()
  return savedSource._id.toString()
}

export async function getAllSources(): Promise<Source[]> {
  await connectToDatabase()
  const sources = await SourceModel.find().sort({ date: -1 })
  return sources.map(mapSourceDocument)
}

export async function deleteSource(id: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false
  }

  await connectToDatabase()
  const result = await SourceModel.deleteOne({ _id: id })
  return result.deletedCount > 0
}

// Funzione per popolare il database con dati di esempio (utile per il testing)
export async function seedDatabase(): Promise<void> {
  await connectToDatabase()

  // Verifica se ci sono già dati nel database
  const eventsCount = await EventModel.countDocuments()

  if (eventsCount > 0) {
    console.log("Il database contiene già dei dati. Operazione di seed saltata.")
    return
  }

  // Dati di esempio per gli eventi
  const eventsData = [
    {
      title: "Alluvione in Emilia-Romagna",
      type: "alluvione",
      location: "Emilia-Romagna, Italia",
      latitude: 44.4949,
      longitude: 11.3426,
      date: new Date("2023-05-16"),
      description:
        "Grave alluvione che ha colpito diverse province dell'Emilia-Romagna, causando esondazioni di fiumi, frane e allagamenti. Le piogge intense hanno provocato l'evacuazione di migliaia di persone e danni significativi alle infrastrutture e alle abitazioni.",
      scientificAnalysis:
        "L'evento è stato causato da precipitazioni eccezionali, con accumuli che hanno superato i 200mm in 36 ore. Secondo l'analisi dell'ISPRA, il fenomeno è stato amplificato da condizioni di saturazione del suolo dovute a piogge precedenti e dalla morfologia del territorio.\n\nLe analisi climatologiche indicano che eventi di questa intensità stanno diventando più frequenti a causa dei cambiamenti climatici, con un aumento stimato del 20% nella frequenza di eventi estremi in questa regione negli ultimi 30 anni.",
      severity: 5,
      status: "Concluso",
      affectedArea: 23000,
      casualties: 17,
      economicDamage: "8,5 miliardi €",
    },
    {
      title: "Terremoto di Amatrice",
      type: "terremoto",
      location: "Amatrice, Lazio, Italia",
      latitude: 42.6271,
      longitude: 13.2888,
      date: new Date("2016-08-24T01:36:00"),
      description:
        "Forte terremoto di magnitudo 6.0 che ha colpito l'Italia centrale, con epicentro vicino ad Amatrice. Il sisma ha causato gravi danni in numerosi comuni tra Lazio, Umbria, Marche e Abruzzo.",
      scientificAnalysis:
        "Il terremoto è stato generato da una faglia normale con direzione NW-SE, tipica dell'Appennino centrale. L'evento si inserisce nella sequenza sismica che caratterizza questa zona, considerata ad alto rischio sismico.\n\nSecondo l'INGV, la profondità ipocentrale è stata stimata a circa 8 km, relativamente superficiale, il che spiega i danni significativi nonostante la magnitudo moderata. Le analisi geologiche hanno evidenziato un'accelerazione del suolo particolarmente elevata, amplificata dalle caratteristiche geomorfologiche locali.",
      severity: 5,
      status: "Concluso",
      affectedArea: 8000,
      casualties: 299,
      economicDamage: "23,5 miliardi €",
    },
    {
      title: "Siccità in Sicilia",
      type: "siccità",
      location: "Sicilia, Italia",
      latitude: 37.599,
      longitude: 14.0154,
      date: new Date("2023-06-01"),
      description:
        "Grave crisi idrica che ha colpito la Sicilia, con particolare intensità nelle province di Agrigento, Caltanissetta e Palermo. La prolungata assenza di precipitazioni ha causato il prosciugamento di invasi e la riduzione delle riserve idriche.",
      scientificAnalysis:
        "L'analisi dei dati pluviometrici mostra un deficit di precipitazioni del 70% rispetto alla media stagionale. Secondo il CNR, questo evento si inserisce in un trend di aridificazione del Mediterraneo, con un aumento della frequenza e dell'intensità dei periodi siccitosi negli ultimi decenni.\n\nI modelli climatici prevedono un ulteriore aggravamento di queste condizioni nei prossimi anni, con impatti significativi sull'agricoltura e sulla disponibilità di acqua potabile. Le temperature medie estive hanno superato di 2,5°C i valori normali, accelerando l'evaporazione e aggravando la situazione.",
      severity: 4,
      status: "In corso",
      affectedArea: 25000,
      casualties: 0,
      economicDamage: "1,2 miliardi € (stima preliminare)",
    },
    {
      title: "Incendio boschivo nel Parco del Cilento",
      type: "incendio",
      location: "Parco Nazionale del Cilento, Campania, Italia",
      latitude: 40.29,
      longitude: 15.36,
      date: new Date("2023-07-25"),
      description:
        "Vasto incendio boschivo che ha interessato diverse aree del Parco Nazionale del Cilento, Vallo di Diano e Alburni. Le fiamme, alimentate da venti forti e temperature elevate, hanno distrutto centinaia di ettari di vegetazione.",
      scientificAnalysis:
        "L'analisi delle condizioni meteorologiche ha evidenziato una combinazione di fattori predisponenti: temperature superiori a 35°C per oltre 10 giorni consecutivi, umidità relativa inferiore al 20% e venti con raffiche fino a 50 km/h.\n\nSecondo i dati del Corpo Forestale, l'incendio è stato di origine dolosa, ma le condizioni ambientali ne hanno favorito la rapida propagazione. Gli studi ecologici preliminari indicano che la rigenerazione della vegetazione richiederà almeno 15-20 anni, con gravi conseguenze sulla biodiversità locale e sull'erosione del suolo.",
      severity: 3,
      status: "Concluso",
      affectedArea: 850,
      casualties: 0,
      economicDamage: "4,5 milioni €",
    },
  ]

  // Inserisci gli eventi
  const insertedEvents = await EventModel.insertMany(eventsData)

  // Dati di esempio per le fonti
  const sourcesData = [
    {
      eventId: insertedEvents[0]._id,
      title: "Rapporto tecnico sull'alluvione in Emilia-Romagna",
      author: "ISPRA - Istituto Superiore per la Protezione e la Ricerca Ambientale",
      type: "article",
      url: "https://example.com/ispra-report",
      date: new Date("2023-06-10"),
    },
    {
      eventId: insertedEvents[0]._id,
      title: "Analisi idrologica degli eventi di maggio 2023",
      author: "Università di Bologna - Dipartimento di Ingegneria Civile",
      type: "article",
      url: "https://example.com/unibo-report",
      date: new Date("2023-07-05"),
    },
    {
      eventId: insertedEvents[1]._id,
      title: "Relazione scientifica sul terremoto di Amatrice",
      author: "INGV - Istituto Nazionale di Geofisica e Vulcanologia",
      type: "article",
      url: "https://example.com/ingv-report",
      date: new Date("2016-09-15"),
    },
    {
      eventId: insertedEvents[1]._id,
      title: "Mappa delle accelerazioni sismiche registrate",
      author: "Protezione Civile Italiana",
      type: "link",
      url: "https://example.com/protezione-civile-map",
      date: new Date("2016-08-30"),
    },
    {
      eventId: insertedEvents[2]._id,
      title: "Bollettino siccità Sicilia 2023",
      author: "CNR - Consiglio Nazionale delle Ricerche",
      type: "article",
      url: "https://example.com/cnr-report",
      date: new Date("2023-07-20"),
    },
    {
      eventId: insertedEvents[3]._id,
      title: "Rapporto incendi boschivi estate 2023",
      author: "Corpo Forestale dello Stato",
      type: "article",
      url: "https://example.com/forestale-report",
      date: new Date("2023-09-10"),
    },
  ]

  // Inserisci le fonti
  await SourceModel.insertMany(sourcesData)

  console.log("Database popolato con successo con i dati di esempio.")
}
