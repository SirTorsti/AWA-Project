import {Request, Response, Router} from 'express'
import { compile } from 'morgan'

const router: Router = Router()

//continue from here: We need to switch to routes to store the columns and eventually the cards. 

router.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

export default router