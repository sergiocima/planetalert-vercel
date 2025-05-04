"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface UriDetails {
  success: boolean
  message: string
  details?: {
    protocol: string
    username: string
    password: string
    host: string
    database: string
  }
  problems?: string[]
}

interface DbStatus {
  success: boolean
  message: string
  mongodb?: {
    connected: boolean
    database: any
  }
}

export default function DiagnosticaPage() {
  const [uriDetails, setUriDetails] = useState<UriDetails | null>(null)
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null)
  const [isLoadingUri, setIsLoadingUri] = useState(false)
  const [isLoadingDb, setIsLoadingDb] = useState(false)

  async function checkUri() {
    setIsLoadingUri(true)
    try {
      const res = await fetch("/api/debug-uri")
      const data = await res.json()
      setUriDetails(data)
    } catch (error) {
      console.error("Errore durante la verifica dell'URI:", error)
    } finally {
      setIsLoadingUri(false)
    }
  }

  async function checkDbStatus() {
    setIsLoadingDb(true)
    try {
      const res = await fetch("/api/debug-db")
      const data = await res.json()
      setDbStatus(data)
    } catch (error) {
      console.error("Errore durante la verifica dello stato del database:", error)
    } finally {
      setIsLoadingDb(false)
    }
  }

  useEffect(() => {
    checkUri()
    checkDbStatus()
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
            <CardTitle>Diagnostica Connessione MongoDB</CardTitle>
            <CardDescription>Verifica e risolvi i problemi di connessione al database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Verifica URI MongoDB</h3>
              <Card>
                <CardContent className="pt-6">
                  {isLoadingUri ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : uriDetails ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {uriDetails.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className={uriDetails.success ? "text-green-500" : "text-red-500"}>
                          {uriDetails.message}
                        </span>
                      </div>

                      {uriDetails.details && (
                        <div className="space-y-2 bg-muted p-3 rounded-md">
                          <p>
                            <strong>Protocollo:</strong> {uriDetails.details.protocol}
                          </p>
                          <p>
                            <strong>Username:</strong> {uriDetails.details.username}
                          </p>
                          <p>
                            <strong>Password:</strong> {uriDetails.details.password}
                          </p>
                          <p>
                            <strong>Host:</strong> {uriDetails.details.host}
                          </p>
                          <p>
                            <strong>Database:</strong> {uriDetails.details.database}
                          </p>
                        </div>
                      )}

                      {uriDetails.problems && uriDetails.problems.length > 0 && (
                        <div className="space-y-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                          <p className="font-medium">Problemi rilevati:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {uriDetails.problems.map((problem, index) => (
                              <li key={index}>{problem}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">Impossibile verificare l'URI MongoDB</div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={checkUri} disabled={isLoadingUri}>
                    {isLoadingUri ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifica in corso...
                      </>
                    ) : (
                      "Verifica URI"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Stato Connessione Database</h3>
              <Card>
                <CardContent className="pt-6">
                  {isLoadingDb ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : dbStatus ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {dbStatus.success && dbStatus.mongodb?.connected ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span
                          className={
                            dbStatus.success && dbStatus.mongodb?.connected ? "text-green-500" : "text-red-500"
                          }
                        >
                          {dbStatus.message}
                        </span>
                      </div>

                      {dbStatus.mongodb?.database && (
                        <div className="space-y-2 bg-muted p-3 rounded-md">
                          <p>
                            <strong>Database:</strong> {dbStatus.mongodb.database.name}
                          </p>
                          <p>
                            <strong>Eventi:</strong> {dbStatus.mongodb.database.collections?.events || 0}
                          </p>
                          <p>
                            <strong>Fonti:</strong> {dbStatus.mongodb.database.collections?.sources || 0}
                          </p>
                        </div>
                      )}

                      {!dbStatus.success && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <span className="font-medium">Possibili cause:</span>
                          </div>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>L'indirizzo IP non è nella whitelist di MongoDB Atlas</li>
                            <li>Le credenziali (username/password) sono errate</li>
                            <li>Il cluster MongoDB non è attivo o raggiungibile</li>
                            <li>C'è un problema di rete o firewall</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Impossibile verificare lo stato del database
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={checkDbStatus} disabled={isLoadingDb}>
                    {isLoadingDb ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifica in corso...
                      </>
                    ) : (
                      "Verifica connessione"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Guida alla risoluzione dei problemi</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">1. Verifica il formato dell'URI MongoDB</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        L'URI deve essere nel formato:
                        <code className="block bg-muted p-2 rounded mt-1 text-xs">
                          mongodb+srv://username:password@cluster.mongodb.net/database
                        </code>
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium">2. Configura la whitelist IP in MongoDB Atlas</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Aggiungi 0.0.0.0/0 alla whitelist per consentire l'accesso da qualsiasi IP:
                        <ol className="list-decimal pl-5 mt-1 space-y-1">
                          <li>Accedi a MongoDB Atlas</li>
                          <li>Vai al tuo cluster</li>
                          <li>Clicca su "Network Access" nel menu laterale</li>
                          <li>Clicca su "Add IP Address"</li>
                          <li>Seleziona "Allow Access from Anywhere"</li>
                          <li>Conferma con "Confirm"</li>
                        </ol>
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium">3. Verifica le credenziali</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Assicurati che username e password siano corretti e che l'utente abbia i permessi necessari per
                        accedere al database.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium">4. Verifica lo stato del cluster</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Assicurati che il cluster MongoDB sia attivo e funzionante accedendo alla dashboard di MongoDB
                        Atlas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
