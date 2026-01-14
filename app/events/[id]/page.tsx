import { getEventById, getRelatedSources } from "@/lib/events"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function EventPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id)
  
  if (!event) {
    notFound()
  }

  const sources = getRelatedSources(event.id)
  const eventDate = new Date(event.date).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">← Torna alla mappa</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <Badge variant={getEventTypeBadgeVariant(event.type)}>{event.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-2">Informazioni generali</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="font-medium">Località:</dt>
                  <dd>{event.location}</dd>
                  <dt className="font-medium">Data:</dt>
                  <dd>{eventDate}</dd>
                  <dt className="font-medium">Stato:</dt>
                  <dd>{event.status}</dd>
                  <dt className="font-medium">Gravità:</dt>
                  <dd>{event.severity}/5</dd>
                  <dt className="font-medium">Area colpita:</dt>
                  <dd>{event.affectedArea.toLocaleString()} km²</dd>
                  <dt className="font-medium">Vittime:</dt>
                  <dd>{event.casualties}</dd>
                  <dt className="font-medium">Danni stimati:</dt>
                  <dd>{event.economicDamage}</dd>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Descrizione</h3>
                <p className="text-sm">{event.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Analisi scientifica</h3>
                <p className="text-sm whitespace-pre-line">{event.scientificAnalysis}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fonti e approfondimenti</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3">
              {sources.map((source) => (
                <li key={source.id} className="text-sm">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="font-medium mb-1">{source.title}</div>
                    <div className="text-muted-foreground">
                      {source.author} - {new Date(source.date).toLocaleDateString("it-IT")}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
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
