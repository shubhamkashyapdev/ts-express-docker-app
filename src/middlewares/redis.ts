import { redisClient } from '@/utilities'
import { NextFunction, Request, Response } from 'express'

export const redisStatic = (KEY: string) => {
    return async function (req: Request, res: Response, next: NextFunction) {
        // check if data exists in redis else set data in redis
        const data = await redisClient.get(KEY)
        if (data) {
            return res.status(200).json({
                success: true,
                status: 'OK',
                data: JSON.parse(data)
            })
        } else {
            next()
        }
    }
}

export const redisById =
    (prefix: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id
        const data = await redisClient.get(`${prefix}:${id}`)
        if (data) {
            res.status(200).json({
                success: true,
                status: 'OK',
                data: JSON.parse(data)
            })
        }
        next()
    }
