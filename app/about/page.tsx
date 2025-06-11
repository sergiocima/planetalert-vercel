import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Chi siamo</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <p>
            PlanetAlert è una piattaforma dedicata al monitoraggio e alla documentazione degli eventi naturali che
            colpiscono il territorio italiano. Il nostro obiettivo è fornire informazioni accurate e tempestive su eventi
            come alluvioni, terremoti, siccità e incendi boschivi.
          </p>

          <h2>La nostra missione</h2>
          <p>
            La nostra missione è duplice:
          </p>
          <ul>
            <li>
              Creare un archivio storico dettagliato degli eventi naturali in Italia, completo di analisi scientifiche
              e dati sugli impatti socio-economici.
            </li>
            <li>
              Sensibilizzare il pubblico sull'importanza della prevenzione e della preparazione agli eventi naturali,
              fornendo informazioni accurate e basate su dati scientifici.
            </li>
          </ul>

          <h2>Le nostre fonti</h2>
          <p>
            Collaboriamo con numerose istituzioni scientifiche e di ricerca italiane, tra cui:
          </p>
          <ul>
            <li>INGV - Istituto Nazionale di Geofisica e Vulcanologia</li>
            <li>ISPRA - Istituto Superiore per la Protezione e la Ricerca Ambientale</li>
            <li>CNR - Consiglio Nazionale delle Ricerche</li>
            <li>Protezione Civile Italiana</li>
            <li>Università e centri di ricerca specializzati</li>
          </ul>

          <h2>Contatti</h2>
          <p>
            Per segnalazioni, collaborazioni o richieste di informazioni, potete contattarci all'indirizzo:{" "}
            <a href="mailto:info@planetalert.it">info@planetalert.it</a>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
