import { SessionUserType } from '@/types'
import { NextFunction, Response, Request } from 'express'
import { Session, SessionData } from 'express-session'

export const protect = (req: Request, res: Response, next: NextFunction) => {
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
