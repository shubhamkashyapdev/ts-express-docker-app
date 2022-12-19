import dotenv from 'dotenv'
dotenv.config()

import createServer from '@/utilities/server'

const app = createServer()
export const viteNodeApp = app
