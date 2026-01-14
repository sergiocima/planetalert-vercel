export type Event = {
  id: string
  title: string
  type: "alluvione" | "terremoto" | "siccità" | "incendio"
  location: string
  latitude: number
  longitude: number
  date: string
  description: string
  scientificAnalysis: string
  severity: 1 | 2 | 3 | 4 | 5
  status: "In corso" | "Concluso"
  affectedArea: number
  casualties: number
  economicDamage: string
}
