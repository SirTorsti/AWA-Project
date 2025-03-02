import mongoose, { Document, Schema } from 'mongoose'

//attach cards to user so url cant be manipulated to show cards
interface ICard extends Document {
    _id: string
    title: string
    body: string
    userId: mongoose.Schema.Types.ObjectId
}

const CardSchema: Schema = new Schema({
    title: {type: String},
    body: {type: String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", CardSchema)

export {Card, ICard, CardSchema}