import mongoose, { Document, Schema } from 'mongoose'

interface ICard extends Document {
    title: string
    content: string
}

const CardSchema = new Schema({
    title: {type: String},
    content: {type: String}
})

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", CardSchema)

export {Card, ICard}