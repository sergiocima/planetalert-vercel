import mongoose, { Schema, type Document } from "mongoose"

export interface ISource extends Document {
  eventId: mongoose.Types.ObjectId | string
  title: string
  author: string
  type: "article" | "link" | "file"
  url?: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

const SourceSchema: Schema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      validate: {
        validator: (v: any) => mongoose.Types.ObjectId.isValid(v),
        message: (props) => `${props.value} non è un ObjectId valido!`,
      },
    },
    title: { type: String, required: true },
    author: { type: String, required: true },
    type: { type: String, required: true, enum: ["article", "link", "file"] },
    url: { type: String },
    date: { type: Date, required: true },
  },
  { timestamps: true },
)

// Aggiungiamo un hook pre-save per assicurarci che eventId sia un ObjectId
SourceSchema.pre("save", function (next) {
  if (this.eventId && typeof this.eventId === "string") {
    try {
      this.eventId = new mongoose.Types.ObjectId(this.eventId)
    } catch (error) {
      return next(new Error(`eventId non valido: ${this.eventId}`))
    }
  }
  next()
})

// Verifica se il modello esiste già per evitare errori in modalità development con hot reload
export default mongoose.models.Source || mongoose.model<ISource>("Source", SourceSchema)
