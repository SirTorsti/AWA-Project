import express, {Request, Response, Router} from 'express'
import { Column } from "../models/Column"
import { Card } from "../models/Card"

const router: Router = Router()

//continue from here: We need to switch to routes to store the columns and eventually the cards. 

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
            console.log("Column id updated")
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

            const card = new Card({title: req.body.title, body: req.body.body})
            column.cards.push(card)
            await column.save()
            res.status(201).json(column)
        } catch(error: any) {
            res.status(400).json({message: error.message})
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
                res.status(404).json({message: "Card not found"})
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