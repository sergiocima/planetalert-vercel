import EventMap from "@/components/event-map"
import EventsList from "@/components/events-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEvents } from "@/lib/events"

export default async function Home() {
  const events = await getEvents()

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">PlanetAlert - Monitoraggio Eventi Naturali</h1>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="map">Mappa</TabsTrigger>
          <TabsTrigger value="list">Lista Eventi</TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="h-[70vh]">
          <EventMap events={events} />
        </TabsContent>
        <TabsContent value="list">
          <EventsList events={events} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
