"use client"

import React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"

export default function NewSourcePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get("eventId")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Carica gli eventi se non è specificato un eventId
  React.useEffect(() => {
    if (!eventId) {
      setIsLoading(true)
      fetch("/api/events")
        .then((res) => res.json())
        .then((data) => {
          setEvents(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Errore durante il caricamento degli eventi:", error)
          setIsLoading(false)
        })
    }
  }, [eventId])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const sourceData = {
      eventId: eventId || (formData.get("eventId") as string),
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      type: formData.get("type") as string,
      url: (formData.get("url") as string) || undefined,
      date: date?.toISOString() || new Date().toISOString(),
    }

    try {
      const response = await fetch("/api/sources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sourceData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Si è verificato un errore durante la creazione della fonte")
      }

      toast({
        title: "Fonte creata",
        description: "La fonte è stata creata con successo",
      })

      // Redirect alla pagina dell'evento
      router.push(`/events/${sourceData.eventId}`)
    } catch (error) {
      console.error("Errore durante la creazione della fonte:", error)
      toast({
        title: "Errore",
        description: String(error),
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Indietro
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Aggiungi nuova fonte</CardTitle>
          <CardDescription>Inserisci i dettagli della fonte scientifica o del report</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo</Label>
                <Input id="title" name="title" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Autore / Organizzazione</Label>
                <Input id="author" name="author" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo di fonte</Label>
                <Select name="type" required defaultValue="article">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Articolo scientifico</SelectItem>
                    <SelectItem value="link">Link / Sito web</SelectItem>
                    <SelectItem value="file">File / Documento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL (opzionale)</Label>
                <Input id="url" name="url" type="url" placeholder="https://" />
              </div>

              <div className="space-y-2">
                <Label>Data pubblicazione</Label>
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

              {!eventId && (
                <div className="space-y-2">
                  <Label htmlFor="eventId">Evento correlato</Label>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <Select name="eventId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona evento" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Salva fonte"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
