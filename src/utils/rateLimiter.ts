import { Request, Response, NextFunction } from 'express'
import { redisClient as redis } from '@/utils/redisClient'

export const rateLimiter = (MAX_CALLS: number, WINDOW_SECONDS: number) => {
    return function (req: Request, res: Response, next: NextFunction) {
        const ip: any =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress

        // increment request hit
        // @ts-ignore
        redis.incr(`ip:${ip}`, (err: any, requests: any) => {
            if (err) return console.log(err)

            // if its first request then set the expiry time
            if (requests <= 1) {
                //@ts-ignore
                redis.expire(`ip:${ip}`, WINDOW_SECONDS, 'NX', function (err) {
                    if (err) return console.log(err)
                })
            }

            //@ts-ignore
            redis.ttl(`ip:${ip}`, (err, ttl) => {
                // limit the number of requests
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
            })
        })
    }
}
