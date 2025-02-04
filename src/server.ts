import express, {Request, Response} from "express"
import config from "./config/config"

const PORT = config.PORT

const app = express()


app.get('/', (req: Request, res: Response) => {
    res.json({message: 'Server is running...'})
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})







