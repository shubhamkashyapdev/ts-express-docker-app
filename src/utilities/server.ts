// import { PostRouter, UserRouter } from '@/routes'
import PostRouter from '@/routes/PostRouter'
import UserRouter from '@/routes/UserRouter'
import logger from '@/utilities/logger'
import {
    aSet,
    REDIS_KEYS,
    aExpire,
    redisClient,
    aGet,
    rateLimiter
} from '@/utilities'
import express, { Request, Response, NextFunction, Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import config from '@/config/config'
import session from 'express-session'
import connectRedis from 'connect-redis'
const RedisStore = connectRedis(session)
import { redisStatic } from '@/middlewares/redis'

const createServer = () => {
    // @todo use app from createServer instead
    const app: Express = express()
    // Routers
    redisClient.on('error', (err) => logger.info('Redis Client Error', err))

    redisClient.connect()
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

    // Headers
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        next()
    })

    // trust the nginx proxy headers
    app.enable('trust proxy')
    app.use(cors())
    app.use(express.json())
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }

    // Request limited to 10 calls per 60 seconds
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

    app.get(
        '/api/v1',
        redisStatic(REDIS_KEYS.HEALTH_CHECK.key),
        async (req, res) => {
            logger.info('get data from DB')
            // fetch/compute data and save in redis
            const axiosRes = JSON.stringify(
                new Array(999).fill(0).sort().sort().sort().reverse()
            )
            //@ts-ignore
            await aSet(REDIS_KEYS.HEALTH_CHECK.key, axiosRes)
            await aExpire(
                REDIS_KEYS.HEALTH_CHECK.key,
                REDIS_KEYS.HEALTH_CHECK.expiresInSeconds
            )
            res.status(200).json({
                type: 'success',
                data: 'DATA FROM DB'
            })
        }
    )
    app.use('/api/v1/post', PostRouter)
    app.use('/api/v1/user', UserRouter)
    // app.use('/api/v1/user', UserRouter)
    return app
}

export default createServer
