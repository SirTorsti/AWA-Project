import { Request, Response, Router } from 'express'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import {User, IUser} from '../models/User'

const router: Router = Router()

router.post("/register", 
    body("username").trim().isLength({min: 4}).escape(),
    body("password").trim().isLength({min: 5}),
    async (req: Request, res: Response ) => {
        const errors: Result<ValidationError> = validationResult(req)
        
        if(!errors.isEmpty()) {
            console.log(errors)
            res.status(400).json({errors: errors.array()})
        }

        try{
            const existingUser: IUser | null = await User.findOne({username: req.body.username})
            if(existingUser) {
                res.status(403).json({username: "Usernmae already in use"})
            }
            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)

            await User.create ({
                username: req.body.username,
                password: hash
            })

            res.status(200).json({message: "User registered successfully"})
        
        } catch (error: any) {
            console.error(`Error during registration: ${error}`)
            res.status(500).json({error: "Internal server error"})
        }
    }
)

router.post("/login",
    body("username").trim().escape(),
    body("password").escape(),
    async ( req: Request, res: Response) => {
        try {
            const user: IUser | null = await User.findOne({username: req.body.username})

            if(!user){
                res.status(401).json({message: "Login failed"})
                return
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const jwtPayload: JwtPayload = {
                    id: user?._id,
                    username: user.username
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "2m"})
                res.status(200).json({success: true, token})
            }
        } catch (error: any) {
            console.error(`Error during login: ${error}`)
            res.status(500).json({error: "Internal server error"})
        }
    }
)

export default router