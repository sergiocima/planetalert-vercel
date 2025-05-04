import { getEventById, getEvents, getRelatedSources } from "@/lib/events"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, AlertTriangle, FileText } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { notFound } from "next/navigation"
import EventMap from "@/components/event-map"
import SourcesList from "@/components/sources-list"

// Aggiungiamo questa funzione per generare i parametri statici
export async function generateStaticParams() {
  try {
    // Durante il build, restituisci un array vuoto per evitare errori
    if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production") {
      return []
    }

    const events = await getEvents()
    return events.map((event) => ({
      id: event.id,
    }))
  } catch (error) {
    console.error("Errore durante la generazione dei parametri statici:", error)
    return [] // In caso di errore, restituisci un array vuoto
  }
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  const sources = await getRelatedSources(params.id)

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost">← Torna alla mappa</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(event.date), "d MMMM yyyy", { locale: it })}
                  </CardDescription>
                </div>
                <Badge className="text-sm" variant={getEventTypeBadgeVariant(event.type)}>
                  {event.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{event.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analisi Scientifica</CardTitle>
              <CardDescription>Commento basato su fonti scientifiche e report locali</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{event.scientificAnalysis}</p>
            </CardContent>
          </Card>

          <Card className="h-[400px]">
            <CardHeader className="pb-0">
              <CardTitle>Posizione dell'evento</CardTitle>
            </CardHeader>
            <CardContent className="h-full pt-4">
              <EventMap events={[event]} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dettagli Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Gravità</h3>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <AlertTriangle
                      key={i}
                      className={`h-5 w-5 ${i < event.severity ? "text-destructive" : "text-muted-foreground opacity-25"}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Stato</h3>
                <Badge variant={event.status === "In corso" ? "destructive" : "outline"}>{event.status}</Badge>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Area interessata</h3>
                <p>{event.affectedArea} km²</p>
              </div>
              {event.casualties !== undefined && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Vittime</h3>
                  <p>{event.casualties}</p>
                </div>
              )}
              {event.economicDamage && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Danni economici stimati</h3>
                  <p>{event.economicDamage}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Fonti ({sources.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SourcesList sources={sources} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Azioni</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/events/${event.id}/edit`} className="w-full">
                <Button variant="outline" className="w-full">
                  Modifica evento
                </Button>
              </Link>
              <Link href={`/sources/new?eventId=${event.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  Aggiungi fonte
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

function getEventTypeBadgeVariant(type: string) {
  switch (type.toLowerCase()) {
    case "alluvione":
      return "blue"
    case "terremoto":
      return "destructive"
    case "siccità":
      return "yellow"
    case "incendio":
      return "orange"
    default:
      return "secondary"
  }
}
