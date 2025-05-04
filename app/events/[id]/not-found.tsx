import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EventNotFound() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-4">Evento non trovato</h1>
      <p className="text-muted-foreground mb-8">L'evento che stai cercando non esiste o è stato rimosso.</p>
      <Link href="/">
        <Button>Torna alla pagina principale</Button>
      </Link>
    </div>
  )
}
