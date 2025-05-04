import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, LinkIcon, Download, ExternalLink, Plus } from "lucide-react"
import Link from "next/link"
import type { Source } from "@/types/source"

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
  const sources = getAllSources()

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fonti Scientifiche</h1>
        <Link href="/sources/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuova Fonte
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Cerca fonti..." />
            </div>
            <div className="w-full md:w-64">
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Filtra per tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  <SelectItem value="article">Articoli scientifici</SelectItem>
                  <SelectItem value="link">Link / Siti web</SelectItem>
                  <SelectItem value="file">File / Documenti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sources.map((source) => (
          <Card key={source.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="bg-muted rounded-md p-3">
                  {source.type === "article" ? (
                    <FileText className="h-6 w-6" />
                  ) : source.type === "link" ? (
                    <LinkIcon className="h-6 w-6" />
                  ) : (
                    <Download className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{source.title}</h3>
                  <p className="text-sm text-muted-foreground">{source.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      {source.type === "article"
                        ? "Articolo scientifico"
                        : source.type === "link"
                          ? "Link / Sito web"
                          : "File / Documento"}
                    </Badge>
                    <Badge variant="outline">{new Date(source.date).toLocaleDateString("it-IT")}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {source.url && (
                    <Link href={source.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apri
                      </Button>
                    </Link>
                  )}
                  <Link href={`/events/${source.eventId}`}>
                    <Button size="sm">Evento correlato</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
