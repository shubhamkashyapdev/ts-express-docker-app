import { aGet } from '@/utilities'
import { NextFunction, Request, Response } from 'express'

export const redisStatic = (KEY: string) => {
    return async function (req: Request, res: Response, next: NextFunction) {
        // check if data exists in redis else set data in redis
        const data = await aGet(KEY)
        if (data) {
            return res.status(200).json({
                type: 'success',
                message: 'DATA FROM REDIS',
                data
            })
        } else {
            next()
        }
    }
}
