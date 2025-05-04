"use client"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import type { Event } from "@/types/event"

// Importiamo Leaflet in modo dinamico per evitare problemi di SSR
const MapWithNoSSR = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <p>Caricamento mappa...</p>
    </div>
  ),
})

export default function EventMap({ events }: { events: Event[] }) {
  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <MapWithNoSSR events={events} />
      </CardContent>
    </Card>
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
