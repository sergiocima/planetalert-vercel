"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Event } from "@/types/event"

export default function MapComponent({ events }: { events: Event[] }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Caricamento mappa...</p>
      </div>
    )
  }

  return (
    <MapContainer
      center={[41.9028, 12.4964]} // Centro Italia
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => (
        <Marker key={event.id} position={[event.latitude, event.longitude]}>
          <Popup>
            <div className="max-w-xs">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <Badge className="mt-1 mb-2" variant={getEventTypeBadgeVariant(event.type)}>
                {event.type}
              </Badge>
              <p className="text-sm mb-2">{event.description.substring(0, 100)}...</p>
              <Link href={`/events/${event.id}`}>
                <Button size="sm" variant="outline" className="w-full">
                  Dettagli
                </Button>
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
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
