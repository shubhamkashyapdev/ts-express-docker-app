import express, { Express } from 'express'
import cors from 'cors'
import session from 'express-session'
import connectRedis from 'connect-redis'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()
import config from '@/config/config'
const RedisStore = connectRedis(session)
import connectDB from '@/config/connectDB'

const app: Express = express()

// Routers
import { PostRouter, UserRouter } from '@/routes'

import {
    redisClient,
    rateLimiter,
    aSet,
    aGet,
    REDIS_KEYS,
    aExpire
} from '@/utilities'

import { redisStatic } from '@/middlewares/redis'
redisClient.on('error', (err) => console.log('Redis Client Error', err))
// mongodb connection
connectDB()
redisClient.connect()
redisClient.on('error', (err) => {
    console.log('redis connection error', err)
})
redisClient.on('connect', async () => {
    console.log(`check redis status`)
    const redisSetValue = await aSet('redis', 'redis-value')
    console.log({ redisSetValue })
    const redisGetValue = await aGet('redis')
    console.log({ redisSetValue, redisGetValue })
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
const PORT = process.env.PORT
const ENVIRONMENT = process.env.NODE_ENV

app.get(
    '/api/v1',
    redisStatic(REDIS_KEYS.HEALTH_CHECK.key),
    async (req, res) => {
        console.log('get data from DB')
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

app.listen(PORT, () => {
    console.log(
        `App is listening on port: ${PORT} in ${ENVIRONMENT} environment`
    )
})
