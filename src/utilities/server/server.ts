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
import { redisClient, aSet, aGet, rateLimiter } from '@/utilities'
import config from '@/config/config'
const createServer = async () => {
    // @todo use app from createServer instead
    const app: Express = express()
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
        const redisSetValue = await aSet('redis', 'redis-value')
        logger.info({ redisSetValue })
        const redisGetValue = await aGet('redis')
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
                maxAge: 60 * 60 * 60
            }
        })
    )
    app.use(function (req, res, next) {
        if (!req.session) {
            return next(new Error('oh no session lost!')) // @todo - handle error
        }
        next() // otherwise continue
    })

    // Redis Setup Ends
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
            data: 'DATA FROM DB - DBZ'
        })
    })

    app.use('/api/v1/post', PostRouter)
    app.use('/api/v1/user', UserRouter)

    // app.use('/api/v1/user', UserRouter)
    return app
}
export default createServer
