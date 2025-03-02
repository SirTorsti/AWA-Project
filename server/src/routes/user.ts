import { Request, Response, Router } from 'express'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import {User, IUser} from '../models/User'

const router: Router = Router()

router.post("/register", 
    body("username").trim().isLength({min: 4}).withMessage("Username must be at least 4 characters long").escape(),
    body("password").trim().isLength({min: 5}).withMessage("Password must be at least 5 characters long"),
    async (req: Request, res: Response ) => {
        const errors: Result<ValidationError> = validationResult(req)
        
        if(!errors.isEmpty()) {
            console.log(errors)
            res.status(400).json({errors: errors.array()})
            return
        }

        try{
            const existingUser: IUser | null = await User.findOne({username: req.body.username})
            if(existingUser) {
                res.status(403).json({username: "Usernmae already in use"})
                return
            }
            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)

            await User.create ({
                username: req.body.username,
                password: hash
            })

            res.status(200).json({message: "User registered successfully"})
            return
        
        } catch (error: any) {
            console.error(`Error during registration: ${error}`)
            res.status(500).json({error: "Internal server error"})
            return
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

            const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
            if (isPasswordValid) {
                const jwtPayload: JwtPayload = {
                    id: user._id,
                    username: user.username
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: "1h" })
                res.status(200).json({ success: true, token })
            } else {
                res.status(401).json({message: "Invalid credentials"})
            }
        } catch (error: any) {
            console.error(`Error during login: ${error}`)
            res.status(500).json({error: "Internal server error"})
        }
    }
)

export default router