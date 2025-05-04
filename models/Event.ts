import mongoose, { Schema, type Document } from "mongoose"

export interface IEvent extends Document {
  title: string
  type: string
  location: string
  latitude: number
  longitude: number
  date: Date
  description: string
  scientificAnalysis: string
  severity: number
  status: string
  affectedArea: number
  casualties?: number
  economicDamage?: string
  createdAt: Date
  updatedAt: Date
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    scientificAnalysis: { type: String, required: true },
    severity: { type: Number, required: true, min: 1, max: 5 },
    status: { type: String, required: true, enum: ["In corso", "Concluso", "Monitoraggio"] },
    affectedArea: { type: Number, required: true },
    casualties: { type: Number },
    economicDamage: { type: String },
  },
  { timestamps: true },
)

// Verifica se il modello esiste già per evitare errori in modalità development con hot reload
export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)
