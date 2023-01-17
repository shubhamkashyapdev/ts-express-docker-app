// import { PostRouter, UserRouter } from '@/routes'
import PostRouter from '@/routes/PostRouter'
import UserRouter from '@/routes/UserRouter'
import express, { Request, Response, NextFunction, Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from '@/config/connectDB'
import session from 'express-session'
import connectRedis from 'connect-redis'
const RedisStore = connectRedis(session)
import { redisStatic } from '@/middlewares/redis'
import logger from '@/utilities/logger'
import { redisClient, rateLimiter } from '@/utilities'
import config from '@/config/config'
import { ErrorResponse } from '@/utilities/errorResponse'
const createServer = async () => {
    // @todo use app from createServer instead
    const app: Express = express()
    connectDB()
    // trust the nginx proxy headers
    app.enable('trust proxy')
    app.use(cors())
    app.use(express.json())
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }
    /**
     * Redis Client Setup
     */
    redisClient.on('error', (err) => logger.info('Redis Client Error', err))
    redisClient.on('error', (err) => {
        logger.info('redis connection error', err)
    })
    redisClient.on('connect', async () => {
        logger.info(`check redis status`)
        const redisSetValue = await redisClient.set('redis', 'redis-value')
        logger.info({ redisSetValue })
        const redisGetValue = await redisClient.get('redis')
        logger.info({ redisSetValue, redisGetValue })
    })
    app.use(rateLimiter(10, 60))
    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            secret: config.SESSION_SECRET || 'sessionsecret',
            saveUninitialized: false,
            resave: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            }
        })
    )
    app.use(function (req, res, next) {
        if (!req.session) {
            return ErrorResponse(res, 'oh no session lost!', 401)
        }
        next() // otherwise continue
    })

    // Redis Setup Ends

    // Headers
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        next()
    })

    app.get('/api/v1', redisStatic('helth-check'), async (req, res) => {
        res.status(200).json({
            type: 'success',
            data: 'DATA FROM DB - DBZ'
        })
    })

    app.use('/api/v1/post', PostRouter)
    app.use('/api/v1/user', UserRouter)

    // app.use('/api/v1/user', UserRouter)
    return app
}
export default createServer
