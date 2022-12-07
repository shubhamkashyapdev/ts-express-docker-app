import { Request, Response, NextFunction } from 'express'
import { aExpire, aIncr, aTtl } from '@/utilities/redis-utils'

export const rateLimiter = (MAX_CALLS: number, WINDOW_SECONDS: number) => {
    return async function (req: Request, res: Response, next: NextFunction) {
        const ip: any =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress
        let ttl

        // increment request hit
        const requests = await aIncr(`ip:${ip}`)

        if (requests <= 1) {
            await aExpire(`ip:${ip}`, WINDOW_SECONDS)
        }

        ttl = await aTtl(`ip:${ip}`)
        if (requests > MAX_CALLS) {
            return res.status(503).json({
                status: 'error',
                callsInMinute: MAX_CALLS,
                ttl
            })
        } else {
            console.log(
                `Number of requests made so far: ${requests} and the limiter will reset in ${ttl}`
            )
            next()
        }
    }
}
