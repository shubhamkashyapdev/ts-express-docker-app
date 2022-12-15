import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'

const validate =
    (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            })
            return next()
        } catch (err: any) {
            return res.status(400).json({
                status: 'error',
                message: err.message
            })
        }
    }
export default validate
