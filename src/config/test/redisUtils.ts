import Redis from 'ioredis-mock'

export const redisClient = new Redis()

export const REDIS_KEYS = {
    HEALTH_CHECK: {
        key: 'health-check',
        expiresInSeconds: 60
    }
} as const
