import express, {Request, Response, Router} from 'express'
import { Column } from "../models/Column"
import { Card, ICard } from "../models/Card"

const router: Router = Router()

    //get all columns
    router.get('/columns', async (req: Request, res: Response) => {
        try {
            const columns = await Column.find()
            res.status(201).json(columns)
        } catch(error: any) {
            res.status(500).json({message: error.message})
        }
    })

    //adding new column
    router.post("/columns", async (req: Request, res: Response) => {
        const column = new Column({
            name: req.body.name,
            cards: []
        })

        try {
            const newColumn = await column.save()
            res.status(201).json(newColumn)
        } catch (error: any) {
            res.status(500).json({message: error.message})
        }
    })

    //renaming of columns
    router.patch("/columns/:id", async(req: Request, res: Response) => {
        try {
            const column = await Column.findById(req.params.id)
            if (!column) {
                res.status(404).json({message: 'Column not found'})
                return
            }
            column.name = req.body.name
            await column.save()
            res.status(200).json(column)
        } catch(error: any) {
            res.status(500).json({message: error.message})
        }
    })

    //deletion of columh
    router.delete("/columns/:id", async (req: Request, res: Response) => {
        try{
            const column = await Column.findById(req.params.id)
            if (!column) {
                res.status(404).json({message: 'Column not found'})
                return
            }
            await Column.deleteOne({ _id: req.params.id })
            res.json(({message: 'Column deleted'}))
        } catch (error: any) {
            res.status(500).json({message: error.message})
        }
    })

    //add card to a spesific column
    router.post("/columns/:id/cards", async (req: Request, res: Response) => {
        try{
            const column = await Column.findById(req.params.id)
            if(!column) {
                res.status(404).json({message: 'Column not found'})
                return
            }

            const card = new Card({ title: req.body.title, body: req.body.body})
            await card.save()
            column.cards.push(card)
            await column.save()
            res.status(201).json(column)
        } catch(error: any) {
            res.status(400).json({message: error.message})
        }
    })

    //edit card title and body
    router.patch("/columns/:columnId/cards/:cardId", async (req: Request, res: Response) => {
        try {
            const column = await Column.findById(req.params.columnId)
            if (!column) {
                res.status(404).json({message: 'column not found'})
                return
            }

            const card = column.cards.find(card => card._id.toString() === req.params.cardId)
         
            if (card) {
                card.title = req.body.title
                card.body = req.body.body
                card.id = req.body.cardId
                await column.save()
                res.status(200).json(column)
            }
        } catch (error: any) {
            res.status(500).json({message: error.message})
        }
    })

    //handle reorder of cards when dragging
    router.post("/columns/:columnId/cards/reorder", async (req: Request, res: Response) => {
        if(!req.body) {
            res.status(400).json({error :"invalid request body"})
        }
        try {
            const column = await Column.findById(req.params.columnId)
            if (!column) {
                res.status(404).json({ message: "Column not found" })
                return
            }
            if(!column.cards) {
                res.status(404).json({message: "Cards not found :("})
            }
            const newOrder = req.body.cards.map((card: any) => column.cards.find(c => c._id.toString() === card._id));

            if(newOrder.includes(undefined)) {
                res.status(400).json({message: "Invalid card IDs in new order"})
                return
            }
            column.cards = newOrder
            await column.save()
            res.status(200).json(column)
        } catch (error: any) {
            console.log("Error during card reorder: ", error)
            res.status(500).json({ message: error.message })
        }
    })

    
    

    //remove card from column
    router.delete("/columns/:columnId/cards/:cardId", async (req: Request, res: Response) => {
        try{
            const column = await Column.findById(req.params.columnId)
            if(!column) {
                res.status(404).json({message: "Column not found"})
                return
            }
            const cardIndex = column.cards.findIndex(card => card._id.toString() === req.params.cardId)
            if (cardIndex === -1) {
                res.status(404).json({message: "Card not found in deletion"})
                return
            }
            column.cards.splice(cardIndex, 1)
            await column.save()
            res.status(200).json(column)

        } catch (error: any) {
            res.status(500).json({message: error.message})
        }
    })
export default router