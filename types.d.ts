import { User } from '@/types'
import * as express from 'express'
declare module 'express-session' {
    interface SessionData {
        user: unknown
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: User | undefined
        }
    }
}
