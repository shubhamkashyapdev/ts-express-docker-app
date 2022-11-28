import { Session, SessionData } from "express-session"

export type User = {
  id: string
  email: string
  password: string
}
export type SessionUserType = Session & Partial<SessionData> & { user: User }
