import config from '@/config/config'
import * as redis from 'redis'

export const redisClient = redis.createClient({
    legacyMode: true,
    url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`
})
