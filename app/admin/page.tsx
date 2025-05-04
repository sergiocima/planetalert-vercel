"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, Database, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface StatusResponse {
  status: string
  mongodb: {
    connected: boolean
    database: {
      name: string
      collections: number
    } | null
  }
  timestamp: string
}

export default function AdminPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  async function checkStatus() {
    setLoading(true)
    try {
      const res = await fetch("/api/status")
      const data = await res.json()
      setStatus(data)
    } catch (error) {
      console.error("Errore durante il controllo dello stato:", error)
      toast({
        title: "Errore",
        description: "Impossibile controllare lo stato del sistema",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function seedDatabase() {
    setSeeding(true)
    try {
      const res = await fetch("/api/seed")
      const data = await res.json()

      if (data.success) {
        toast({
          title: "Database inizializzato",
          description: "Il database è stato popolato con i dati di esempio",
        })
      } else {
        throw new Error(data.message || "Errore durante l'inizializzazione del database")
      }

      // Aggiorna lo stato dopo il seeding
      checkStatus()
    } catch (error) {
      console.error("Errore durante l'inizializzazione del database:", error)
      toast({
        title: "Errore",
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setSeeding(false)
    }
  }

  useEffect(() => {
    checkStatus()
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
            <CardTitle>Pannello di Amministrazione</CardTitle>
            <CardDescription>Gestisci e monitora lo stato dell'applicazione</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Stato del Sistema</h3>
                <Card>
                  <CardContent className="pt-6">
                    {loading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : status ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">MongoDB:</span>
                          <div className="flex items-center">
                            {status.mongodb.connected ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-green-500">Connesso</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-red-500">Non connesso</span>
                              </>
                            )}
                          </div>
                        </div>

                        {status.mongodb.database && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Database:</span>
                              <span>{status.mongodb.database.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Collezioni:</span>
                              <span>{status.mongodb.database.collections}</span>
                            </div>
                          </>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Ultimo aggiornamento:</span>
                          <span>{new Date(status.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">Nessuna informazione disponibile</div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={checkStatus} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Aggiornamento...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Aggiorna stato
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Gestione Database</h3>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Inizializza il database con dati di esempio. Questa operazione è sicura e non sovrascriverà i dati
                      esistenti.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={seedDatabase} disabled={seeding || loading}>
                      {seeding ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inizializzazione...
                        </>
                      ) : (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Inizializza database
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
