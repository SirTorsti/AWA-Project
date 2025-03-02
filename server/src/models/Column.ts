import mongoose, { Schema, Document } from 'mongoose'
import { CardSchema, ICard} from "./Card"

//attach user to columns so url can't be manipulated to show columns
interface IColumn extends Document {
    _id: string
    name: string
    userId: mongoose.Schema.Types.ObjectId
    cards: ICard[]
}

const ColumnSchema: Schema = new Schema<IColumn>({
    name: { type: String, required: true },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', reqired: true},
    cards: {type: [CardSchema], default: [] as ICard[] }
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("Column", ColumnSchema)

export { Column, IColumn }