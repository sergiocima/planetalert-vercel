"use client"

import type React from "react"

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

export default function NewSourcePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get("eventId")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    // Simuliamo un salvataggio
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect alla pagina dell'evento
    if (eventId) {
      router.push(`/events/${eventId}`)
    } else {
      router.push("/sources")
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
                  <Select name="eventId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Alluvione in Emilia-Romagna</SelectItem>
                      <SelectItem value="2">Terremoto di Amatrice</SelectItem>
                      <SelectItem value="3">Siccità in Sicilia</SelectItem>
                      <SelectItem value="4">Incendio boschivo nel Parco del Cilento</SelectItem>
                    </SelectContent>
                  </Select>
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
