import mongoose, { Schema, Document } from 'mongoose'

interface IColumn extends Document {
    name: string
}

const ColumnSchema: Schema = new Schema({
    name: { type: String, required: true }
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("Column", ColumnSchema)

export { Column, IColumn }