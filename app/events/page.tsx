import { getEvents } from "@/lib/events"
import EventsList from "@/components/events-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function EventsPage() {
  const events = getEvents()

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Eventi</h1>
        <Link href="/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Evento
          </Button>
        </Link>
      </div>

      <EventsList events={events} />
    </main>
  )
}
