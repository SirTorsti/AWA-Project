import express, {Express, Request, Response} from 'express'
import path from 'path'
import morgan from 'morgan'
import mongoose, { Connection } from 'mongoose'
import dotenv from 'dotenv'
import cors, {CorsOptions} from 'cors'
import router from './src/routes/index'
import userRouter from './src/routes/user'

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 8001

const mongoDB: string = "mongodb://localhost:27017/projectDB"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))

const corsOptions: CorsOptions= {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, '../public')))
app.use("/", router)
app.use("/user", userRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})