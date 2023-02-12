import config from '@/config/config'
import Redis from 'ioredis'

const ENV = process.env.NODE_ENV

export const redisClient =
    ENV === 'vite'
        ? new Redis()
        : new Redis(`redis://${config.REDIS_URL}:${config.REDIS_PORT}`)

export const REDIS_KEYS = {
    HEALTH_CHECK: {
        key: 'health-check',
        expiresInSeconds: 60
    }
} as const
