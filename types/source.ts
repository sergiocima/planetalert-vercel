export interface Source {
  id: string
  eventId: string
  title: string
  author: string
  type: "article" | "link" | "file"
  url?: string
  date: string
}
