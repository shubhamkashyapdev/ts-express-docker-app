import { Session, SessionData } from 'express-session'
import { Request } from 'express'

export interface AuthRequest extends Request {
    user: User
}

export type User = {
    id: string
    email: string
    password: string
}
export type SessionUserType = Session & Partial<SessionData> & { user: User }
