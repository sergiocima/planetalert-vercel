import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, LinkIcon, Download, ExternalLink, Plus } from "lucide-react"
import Link from "next/link"
import type { Source } from "@/types/source"
import { getEvents, getRelatedSources } from "@/lib/events"

// Modifichiamo la funzione per non essere asincrona
function getAllSources(): Source[] {
  // In un'applicazione reale, qui ci sarebbe una query al database
  return [
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
}

export default function SourcesPage() {
  const events = getEvents()
  const allSources = events.flatMap((event) => {
    const sources = getRelatedSources(event.id)
    return sources.map((source) => ({
      ...source,
      event: event,
    }))
  })

  // Ordina le fonti per data, dalla più recente
  const sortedSources = allSources.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Fonti e documenti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {sortedSources.map((source) => (
              <div key={source.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{source.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {source.author} - {new Date(source.date).toLocaleDateString("it-IT")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Evento: {source.event.title}
                    </p>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Visualizza →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
