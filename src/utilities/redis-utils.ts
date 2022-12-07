import config from '@/config/config'
import * as redis from 'redis'
import { promisify } from 'util'

export const redisClient = process.env.REDIS_URI
    ? redis.createClient()
    : redis.createClient({
          legacyMode: true,
          url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`
      })

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
