import mongoose, { Schema, Document } from 'mongoose'
import { CardSchema, ICard} from "./Card"

interface IColumn extends Document {
    _id: string
    name: string
    cards: ICard[]
}

const ColumnSchema: Schema = new Schema({
    name: { type: String, required: true },
    cards: {type: [CardSchema], default: []}
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("Column", ColumnSchema)

export { Column, IColumn }