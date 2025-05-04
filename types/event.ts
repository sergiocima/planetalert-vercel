export interface Event {
  id: string
  title: string
  type: string
  location: string
  latitude: number
  longitude: number
  date: string
  description: string
  scientificAnalysis: string
  severity: number
  status: string
  affectedArea: number
  casualties?: number
  economicDamage?: string
}
