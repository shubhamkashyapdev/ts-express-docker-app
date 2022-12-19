import { Response } from 'express'

export const handleError = (res: Response, err: unknown) => {
    if (err instanceof Error) {
        return res.status(500).json({
            type: 'error',
            message: err.message
        })
    } else {
        return res.status(500).json({
            type: 'error',
            message: err
        })
    }
}
