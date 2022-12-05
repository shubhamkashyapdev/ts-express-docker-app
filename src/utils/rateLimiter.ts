import { Request, Response, NextFunction } from 'express'
import { redisClient as redis } from '@/utils/redisClient'

export const rateLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const ip: any =
        req.headers['x-forwarded-for'] || req.connection.remoteAddress
    console.log(`ip:${ip}`)
    let ttl = 0
    // @ts-ignore
    redis.incr(`ip:${ip}`, (err: any, requests: any) => {
        if (err) return console.log(err)

        if (requests <= 1) {
            //@ts-ignore
            redis.expire(`ip:${ip}`, 60, 'NX', function (err, expiresIn) {
                if (err) return console.log(err)
                console.log(`Limiter will reset in ${expiresIn} seconds`)
            })
        }
        if (requests > 10) {
            return res.status(503).send('API limit exceeded')
        } else {
            console.log(
                `Number of requests made so far: ${requests} and the limiter will reset in ${ttl}`
            )

            next()
        }
    })
}
