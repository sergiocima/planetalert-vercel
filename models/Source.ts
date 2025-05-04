import mongoose, { Schema, type Document } from "mongoose"

export interface ISource extends Document {
  eventId: mongoose.Types.ObjectId
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
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    type: { type: String, required: true, enum: ["article", "link", "file"] },
    url: { type: String },
    date: { type: Date, required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Source || mongoose.model<ISource>("Source", SourceSchema)
