import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost">← Torna alla mappa</Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informazioni su PlanetAlert</CardTitle>
            <CardDescription>Monitoraggio e analisi scientifica degli eventi naturali</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              PlanetAlert è una piattaforma dedicata al monitoraggio e all'analisi scientifica degli eventi naturali
              come alluvioni, terremoti, siccità e altri fenomeni che impattano sul territorio e sull'ambiente.
            </p>
            <p>
              Il nostro obiettivo è fornire informazioni accurate e basate su dati scientifici, geolocalizzando gli
              eventi e raccogliendo fonti autorevoli per una comprensione approfondita dei fenomeni naturali.
            </p>
            <p>La piattaforma permette di:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visualizzare gli eventi naturali su una mappa interattiva</li>
              <li>Consultare analisi scientifiche basate su fonti verificate</li>
              <li>Contribuire aggiungendo nuovi eventi o fonti scientifiche</li>
              <li>Monitorare l'evoluzione degli eventi in corso</li>
              <li>Accedere a dati storici per analisi comparative</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metodologia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>La nostra metodologia si basa su un approccio rigoroso che combina:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Raccolta automatica di notizie da fonti giornalistiche verificate</li>
              <li>Geolocalizzazione precisa degli eventi</li>
              <li>Analisi scientifica basata su report tecnici, articoli accademici e dati ufficiali</li>
              <li>Contributi della comunità scientifica e degli utenti, sottoposti a verifica</li>
              <li>Aggiornamenti continui sugli eventi in corso</li>
            </ul>
            <p>
              Ogni evento viene classificato in base alla tipologia, alla gravità e all'impatto, e viene corredato da
              un'analisi scientifica che ne spiega le cause, il contesto e le possibili conseguenze.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fonti e collaborazioni</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>NaturalEvents collabora con diverse istituzioni scientifiche e utilizza fonti autorevoli, tra cui:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>INGV - Istituto Nazionale di Geofisica e Vulcanologia</li>
              <li>ISPRA - Istituto Superiore per la Protezione e la Ricerca Ambientale</li>
              <li>CNR - Consiglio Nazionale delle Ricerche</li>
              <li>Protezione Civile</li>
              <li>Università e centri di ricerca nazionali e internazionali</li>
              <li>Agenzie meteorologiche e ambientali</li>
            </ul>
            <p>
              Tutte le fonti utilizzate sono citate e accessibili attraverso la piattaforma, garantendo la trasparenza e
              la verificabilità delle informazioni.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
