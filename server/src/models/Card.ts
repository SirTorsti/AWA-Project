import mongoose, { Document, Schema } from 'mongoose'

interface ICard extends Document {
    _id: string
    title: string
    body: string
}

const CardSchema: Schema = new Schema({
    title: {type: String},
    body: {type: String}
})

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", CardSchema)

export {Card, ICard, CardSchema}