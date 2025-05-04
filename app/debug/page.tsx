"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEnvInfo() {
      try {
        const res = await fetch("/api/debug")
        const data = await res.json()
        setEnvVars(data.env || {})
      } catch (error) {
        console.error("Errore durante il recupero delle informazioni:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnvInfo()
  }, [])

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost">← Torna alla home</Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informazioni di Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Variabili d'ambiente pubbliche:</h3>
                {loading ? (
                  <p>Caricamento...</p>
                ) : Object.keys(envVars).length > 0 ? (
                  <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(envVars, null, 2)}</pre>
                ) : (
                  <p className="text-muted-foreground">Nessuna variabile d'ambiente pubblica disponibile</p>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Stato MongoDB:</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => window.open("/api/status", "_blank")}>
                    Verifica stato MongoDB
                  </Button>
                  <Button variant="outline" onClick={() => window.open("/api/seed", "_blank")}>
                    Inizializza database
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
