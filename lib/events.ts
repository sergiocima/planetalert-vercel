import type { Event } from "@/types/event"
import type { Source } from "@/types/source"

// Dati di esempio per la demo
const eventsData: Event[] = [
  {
    id: "1",
    title: "Alluvione in Emilia-Romagna",
    type: "alluvione",
    location: "Emilia-Romagna, Italia",
    latitude: 44.4949,
    longitude: 11.3426,
    date: "2023-05-16T00:00:00.000Z",
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
    id: "2",
    title: "Terremoto di Amatrice",
    type: "terremoto",
    location: "Amatrice, Lazio, Italia",
    latitude: 42.6271,
    longitude: 13.2888,
    date: "2016-08-24T01:36:00.000Z",
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
    id: "3",
    title: "Siccità in Sicilia",
    type: "siccità",
    location: "Sicilia, Italia",
    latitude: 37.599,
    longitude: 14.0154,
    date: "2023-06-01T00:00:00.000Z",
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
    id: "4",
    title: "Incendio boschivo nel Parco del Cilento",
    type: "incendio",
    location: "Parco Nazionale del Cilento, Campania, Italia",
    latitude: 40.29,
    longitude: 15.36,
    date: "2023-07-25T00:00:00.000Z",
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

const sourcesData: Source[] = [
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
  {
    id: "3",
    eventId: "2",
    title: "Relazione scientifica sul terremoto di Amatrice",
    author: "INGV - Istituto Nazionale di Geofisica e Vulcanologia",
    type: "article",
    url: "https://example.com/ingv-report",
    date: "2016-09-15T00:00:00.000Z",
  },
  {
    id: "4",
    eventId: "2",
    title: "Mappa delle accelerazioni sismiche registrate",
    author: "Protezione Civile Italiana",
    type: "link",
    url: "https://example.com/protezione-civile-map",
    date: "2016-08-30T00:00:00.000Z",
  },
  {
    id: "5",
    eventId: "3",
    title: "Bollettino siccità Sicilia 2023",
    author: "CNR - Consiglio Nazionale delle Ricerche",
    type: "article",
    url: "https://example.com/cnr-report",
    date: "2023-07-20T00:00:00.000Z",
  },
  {
    id: "6",
    eventId: "4",
    title: "Rapporto incendi boschivi estate 2023",
    author: "Corpo Forestale dello Stato",
    type: "article",
    url: "https://example.com/forestale-report",
    date: "2023-09-10T00:00:00.000Z",
  },
]

// Funzioni per interagire con i dati
export function getEvents(): Event[] {
  // In un'applicazione reale, qui ci sarebbe una chiamata a un database
  return eventsData
}

export function getEventById(id: string): Event | undefined {
  // In un'applicazione reale, qui ci sarebbe una query al database
  return eventsData.find((event) => event.id === id)
}

export function getRelatedSources(eventId: string): Source[] {
  // In un'applicazione reale, qui ci sarebbe una query al database
  return sourcesData.filter((source) => source.eventId === eventId)
}

export function createEvent(eventData: Omit<Event, "id">): string {
  // In un'applicazione reale, qui ci sarebbe un'inserimento nel database
  const newId = (eventsData.length + 1).toString()

  return newId
}
