// import { PostRouter, UserRouter } from '@/routes'
import PostRouter from '@/routes/PostRouter'
import UserRouter from '@/routes/UserRouter'
import express, { Request, Response, NextFunction, Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from '@/config/connectDB'

const createServer = () => {
    // @todo use app from createServer instead
    const app: Express = express()
    // trust the nginx proxy headers
    app.enable('trust proxy')
    app.use(cors())
    app.use(express.json())
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }

    if (
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'development'
    ) {
        connectDB()
    }
    // Headers
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        next()
    })

    app.get('/api/v1', async (req, res) => {
        res.status(200).json({
            type: 'success',
            data: 'DATA FROM DB - ZO'
        })
    })

    app.use('/api/v1/post', PostRouter)
    app.use('/api/v1/user', UserRouter)
    // app.use('/api/v1/user', UserRouter)
    return app
}
export default createServer
