import config from '@/config/config'
import Redis from 'ioredis'
import { promisify } from 'util'
const ENV = process.env.NODE_ENV
console.log({ ENV, config })
export const redisClient =
    ENV === 'vite'
        ? new Redis()
        : new Redis(`redis://${config.REDIS_URL}:${config.REDIS_PORT}`)

export const aSet = promisify(redisClient.set).bind(redisClient)
export const aGet = promisify(redisClient.get).bind(redisClient)
export const aTtl = promisify(redisClient.ttl).bind(redisClient)
export const aExpire = promisify(redisClient.expire).bind(redisClient)
export const aIncr = promisify(redisClient.incr).bind(redisClient)

export const REDIS_KEYS = {
    HEALTH_CHECK: {
        key: 'health-check',
        expiresInSeconds: 60
    }
} as const
