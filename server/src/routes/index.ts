import express, {Request, Response, Router} from 'express'
import { Column } from "../models/Column"
import { Card, ICard } from "../models/Card"
import { CustomRequest, validateToken } from "../middleware/validateToken"

const router: Router = Router()

    //get all columns
    router.get('/columns', validateToken, async (req: CustomRequest, res: Response) => {
        try {
            if(!req.user) {
                res.status(401).json({message: "User not authenticated"})
                return
            }
            const userId = req.user.id
            const columns = await Column.find({userId})
            res.status(200).json(columns)
        } catch(error: any) {
            res.status(500).json({message: error.message})
            return
        }
    })

    //adding new column
    router.post("/columns", validateToken, async (req: CustomRequest, res: Response) => {
        
        try{
            if(!req.user) {
                res.status(401).json({message: "User not authenticated"})
                return
            }

            const column = new Column({
                name: req.body.name,
                cards: [],
                userId: req.user.id
            })
        
            const newColumn = await column.save()
            res.status(201).json(newColumn)
        } catch (error: any) {
            res.status(500).json({message: error.message})
            return
        }
    })

    //renaming of columns
    router.patch("/columns/:id", validateToken, async(req: CustomRequest, res: Response) => {
        try {
            const column = await Column.findOne({ _id: req.params.id, userId: req.user?.id })
            if (!column) {
                res.status(404).json({message: 'Column not found'})
                return
            }
            if(!req.user) {
                res.status(401).json({message: "User not authenticated"})
                return
            }
            const userId = req.user.id
            column.name = req.body.name
            await column.save(userId)
            res.status(200).json(column)
        } catch(error: any) {
            res.status(500).json({message: error.message})
            return
        }
    })

    //deletion of columh
    router.delete("/columns/:id", validateToken, async (req: CustomRequest, res: Response) => {
        try{
            if(!req.user) {
                res.status(401).json({message: "User not authenticated"})
                return
            }
            const column = await Column.findOne({ _id: req.params.id, userId: req.user?.id })
            if (!column) {
                res.status(404).json({message: 'Column not found'})
                return
            }
            await Column.deleteOne({ _id: req.params.id, userId: req.user?.id })
            res.json(({message: 'Column deleted'}))
        } catch (error: any) {
            res.status(500).json({message: error.message})
            return
        }
    })

    //add card to a spesific column
    router.post("/columns/:id/cards", validateToken, async (req: CustomRequest, res: Response) => {
        try{
            if(!req.user) {
                res.status(401).json({message: "User not authenticated"})
                return
            }
            const column = await Column.findOne({ _id: req.params.id, userId: req.user?.id })
            if(!column) {
                res.status(404).json({message: 'Column not found'})
                return
            }

            const card = new Card({ title: req.body.title, body: req.body.body, userId: req.user.id})
            await card.save()
            column.cards.push(card)
            await column.save()
            res.status(201).json(column)
        } catch(error: any) {
            res.status(400).json({message: error.message})
            return
        }
    })

    //edit card title and body
    router.patch("/columns/:columnId/cards/:cardId", validateToken, async (req: CustomRequest, res: Response) => {
        try {
            if(!req.user) {
                res.status(401).json({message: "User not authenticated"})
                return
            }
            const column = await Column.findOne({ _id: req.params.columnId, userId: req.user?.id })
            if (!column) {
                res.status(404).json({message: 'column not found'})
                return
            }

            const card = column.cards.find(card => card._id.toString() === req.params.cardId)
         
            if (!card) {
                res.status(404).json({message: "Card not found"})
                return
            }

            card.title = req.body.title || card.title
            card.body = req.body.body || card.body

            await column.save()

            res.status(200).json(column)

        } catch (error: any) {
            res.status(500).json({message: error.message})
            return
        }
    })

    //handle reorder of cards when dragging
    router.post("/columns/:columnId/cards/reorder", validateToken, async (req: CustomRequest, res: Response) => {
        try {
            if(!req.user) {
                res.status(401).json({message: "User not authenticated"})
                return
            }
            const column = await Column.findOne({ _id: req.params.columnId, userId: req.user?.id })
            if (!column) {
                res.status(404).json({ message: "Column not found" })
                return
            }
            if(!Array.isArray(column.cards)) {
                res.status(404).json({message: "Cards not found :("})
                return
            }
            const newOrder = req.body.cards.map((card: any) => column.cards.find(c => c._id.toString() === card._id))

            if(newOrder.includes(undefined)) {
                res.status(400).json({message: "Invalid card IDs in new order"})
                return
            }
            column.cards = newOrder
            await column.save()
            res.status(200).json(column)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
            return
        }
    })

    
    

    //remove card from column
    router.delete("/columns/:columnId/cards/:cardId", validateToken, async (req: CustomRequest, res: Response) => {
        try{
            if(!req.user) {
                res.status(401).json({message: "User not authenticated"})
                return
            }
            const column = await Column.findOne({ _id: req.params.columnId, userId: req.user?.id })

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
            return
        }
    })
export default router