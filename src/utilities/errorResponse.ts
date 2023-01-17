import { Response } from 'express'
import logger from '@/utilities/logger'

export const ErrorResponse = (res: Response, err: string, status: number) => {
    logger.info(err)
    return res.status(status || 500).json({
        success: false,
        type: 'error',
        status: status || 500,
        message: err
    })
}
