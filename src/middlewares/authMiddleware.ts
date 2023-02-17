import { decodeJWT } from '@/controller/UserController/UserController'
import { User } from '@/types'
import { SessionUserType } from '@/types'
import { ErrorResponse } from '@/utilities/errorResponse'
import { NextFunction, Response, Request } from 'express'
import { Session, SessionData } from 'express-session'

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const tokenPayload = req.headers['authorization']
    const token = tokenPayload?.split('Bearer')[1].trim()
    if (token) {
        try {
            const jwtUser = await decodeJWT(token)
            if (jwtUser) {
                const payload: User = {
                    email: jwtUser.email,
                    id: jwtUser.id,
                    password: jwtUser.password
                }
                req.user = payload
                next()
            }
        } catch (err) {
            if (err instanceof Error) {
                ErrorResponse(res, err.message, 400)
            }
        }
    } else {
        const session: Session & Partial<SessionData> = req.session
        const { user } = session as SessionUserType
        if (!user) {
            return res.status(401).json({
                type: 'error',
                message: 'Unauthorized'
            })
        }

        req.user = user
        next()
    }
}
