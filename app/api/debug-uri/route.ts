import { NextResponse } from "next/server"

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI || ""

    // Verifica se l'URI è presente
    if (!uri) {
      return NextResponse.json({
        success: false,
        message: "URI MongoDB non configurato",
      })
    }

    // Analizza l'URI per verificarne il formato
    let parsedUri: URL
    try {
      parsedUri = new URL(uri)
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "URI MongoDB non valido",
        format: "Formato atteso: mongodb+srv://username:password@cluster.mongodb.net/database",
      })
    }

    // Estrai le parti dell'URI (nascondendo la password)
    const protocol = parsedUri.protocol
    const username = parsedUri.username
    const hasPassword = !!parsedUri.password
    const host = parsedUri.host
    const pathname = parsedUri.pathname

    // Verifica il formato
    const isValidProtocol = protocol === "mongodb:" || protocol === "mongodb+srv:"
    const hasUsername = !!username
    const hasHost = !!host
    const hasDatabase = pathname && pathname !== "/"

    const formatProblems = []
    if (!isValidProtocol) formatProblems.push("Protocollo non valido (deve essere mongodb: o mongodb+srv:)")
    if (!hasUsername) formatProblems.push("Username mancante")
    if (!hasPassword) formatProblems.push("Password mancante")
    if (!hasHost) formatProblems.push("Host mancante")
    if (!hasDatabase) formatProblems.push("Nome database mancante")

    return NextResponse.json({
      success: formatProblems.length === 0,
      message: formatProblems.length === 0 ? "URI MongoDB valido" : "URI MongoDB non valido",
      details: {
        protocol: isValidProtocol ? protocol : `${protocol} (non valido)`,
        username: hasUsername ? username : "(mancante)",
        password: hasPassword ? "********" : "(mancante)",
        host: hasHost ? host : "(mancante)",
        database: hasDatabase ? pathname.substring(1) : "(mancante)",
      },
      problems: formatProblems,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Errore durante l'analisi dell'URI MongoDB",
      error: String(error),
    })
  }
}
