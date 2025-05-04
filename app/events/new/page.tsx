"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { createEvent } from "@/lib/events"
import Link from "next/link"

export default function NewEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Modifichiamo la funzione handleSubmit per non utilizzare await
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const eventData = {
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      location: formData.get("location") as string,
      latitude: Number.parseFloat(formData.get("latitude") as string),
      longitude: Number.parseFloat(formData.get("longitude") as string),
      date: date?.toISOString() || new Date().toISOString(),
      description: formData.get("description") as string,
      scientificAnalysis: formData.get("scientificAnalysis") as string,
      severity: Number.parseInt(formData.get("severity") as string),
      status: formData.get("status") as string,
      affectedArea: Number.parseFloat(formData.get("affectedArea") as string),
      casualties: formData.get("casualties") ? Number.parseInt(formData.get("casualties") as string) : undefined,
      economicDamage: formData.get("economicDamage") as string,
    }

    try {
      const newEventId = createEvent(eventData)
      // Simuliamo un ritardo prima del redirect
      setTimeout(() => {
        router.push(`/events/${newEventId}`)
      }, 1000)
    } catch (error) {
      console.error("Errore durante la creazione dell'evento:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost">← Torna alla mappa</Button>
        </Link>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Aggiungi nuovo evento</CardTitle>
          <CardDescription>Inserisci i dettagli dell'evento naturale da monitorare</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titolo</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo di evento</Label>
                  <Select name="type" required defaultValue="alluvione">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alluvione">Alluvione</SelectItem>
                      <SelectItem value="terremoto">Terremoto</SelectItem>
                      <SelectItem value="siccità">Siccità</SelectItem>
                      <SelectItem value="incendio">Incendio</SelectItem>
                      <SelectItem value="altro">Altro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Località</Label>
                <Input id="location" name="location" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitudine</Label>
                  <Input id="latitude" name="latitude" type="number" step="any" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitudine</Label>
                  <Input id="longitude" name="longitude" type="number" step="any" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} locale={it} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea id="description" name="description" rows={4} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scientificAnalysis">Analisi Scientifica</Label>
                <Textarea id="scientificAnalysis" name="scientificAnalysis" rows={6} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Gravità (1-5)</Label>
                  <Select name="severity" required defaultValue="3">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona gravità" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Minima</SelectItem>
                      <SelectItem value="2">2 - Bassa</SelectItem>
                      <SelectItem value="3">3 - Media</SelectItem>
                      <SelectItem value="4">4 - Alta</SelectItem>
                      <SelectItem value="5">5 - Estrema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Stato</Label>
                  <Select name="status" required defaultValue="In corso">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona stato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In corso">In corso</SelectItem>
                      <SelectItem value="Concluso">Concluso</SelectItem>
                      <SelectItem value="Monitoraggio">Monitoraggio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="affectedArea">Area interessata (km²)</Label>
                  <Input id="affectedArea" name="affectedArea" type="number" step="any" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="casualties">Vittime (opzionale)</Label>
                  <Input id="casualties" name="casualties" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="economicDamage">Danni economici (opzionale)</Label>
                  <Input id="economicDamage" name="economicDamage" placeholder="es. 10 milioni €" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline">Annulla</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Salva evento"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
