"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Info } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/types/event"
import { format } from "date-fns"
import { it } from "date-fns/locale"

export default function EventsList({ events }: { events: Event[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || event.type.toLowerCase() === filterType.toLowerCase()

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input placeholder="Cerca eventi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="w-full md:w-64">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filtra per tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli eventi</SelectItem>
              <SelectItem value="alluvione">Alluvione</SelectItem>
              <SelectItem value="terremoto">Terremoto</SelectItem>
              <SelectItem value="siccità">Siccità</SelectItem>
              <SelectItem value="incendio">Incendio</SelectItem>
              <SelectItem value="altro">Altro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2">Nessun evento trovato con i criteri di ricerca specificati.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant={getEventTypeBadgeVariant(event.type)}>{event.type}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </CardDescription>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(event.date), "d MMMM yyyy", { locale: it })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/events/${event.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Visualizza dettagli
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
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
