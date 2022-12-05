import config from '@/config/config'
import 'reflect-metadata'
import express, { Express } from 'express'
import cors from 'cors'
import session from 'express-session'
import connectRedis from 'connect-redis'
import morgan from 'morgan'
const RedisStore = connectRedis(session)
import connectDB from '@/config/connectDB'

const app: Express = express()

// Routers
import PostRouter from '@/routes/PostRouter'
import UserRouter from '@/routes/UserRouter'
import { redisClient } from '@/utils/redisClient'
import { rateLimiter } from '@/utils/rateLimiter'
redisClient.on('error', (err) => console.log('Redis Client Error', err))
// mongodb connection
connectDB()
redisClient.connect()
redisClient
    .on('connect', async () => {
        // @ts-ignore
        console.log(`connected to redis`)
    })
    .on('error', (err) => {
        console.log('redis connection error', err)
    })
// trust the nginx proxy headers
app.enable('trust proxy')
app.use(cors())
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: config.SESSION_SECRET || '',
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 3
        }
    })
)
app.use(rateLimiter)
app.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('oh no session lost!')) // @todo - handle error
    }
    next() // otherwise continue
})
const PORT = process.env.PORT
const ENVIRONMENT = process.env.NODE_ENV

app.get('/api/v1', (req, res) => {
    res.send(`<h1>API is Working!</h1>`)
    console.log('------- It Ran!! -------')
})
app.use('/api/v1/post', PostRouter)
app.use('/api/v1/user', UserRouter)

app.listen(PORT, () => {
    console.log(
        `App is listening on port: ${PORT} in ${ENVIRONMENT} environment`
    )
})
