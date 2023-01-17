import { Request, Response, NextFunction } from 'express'
import { redisClient } from '@/utilities'
import logger from '@/utilities/logger'

export const rateLimiter = (MAX_CALLS: number, WINDOW_SECONDS: number) => {
    return async function (req: Request, res: Response, next: NextFunction) {
        const ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress

        // increment request hit
        const requests = await redisClient.incr(`ip:${ip}`)

        if (requests <= 1) {
            await redisClient.expire(`ip:${ip}`, WINDOW_SECONDS)
        }

        const ttl = await redisClient.ttl(`ip:${ip}`)
        if (requests > MAX_CALLS) {
            return res.status(503).json({
                status: 'error',
                callsInMinute: MAX_CALLS,
                ttl
            })
        } else {
            logger.info(
                `Number of requests made so far: ${requests} and the limiter will reset in ${ttl}`
            )
            next()
        }
    }
}
