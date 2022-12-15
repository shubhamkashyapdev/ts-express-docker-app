import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from '@/config/connectDB'
import logger from '@/utilities/logger'
import { Server, Socket } from 'socket.io'
import createServer from '@/utilities/server'

const PORT = process.env.PORT
const ENVIRONMENT = process.env.NODE_ENV
const app = createServer()
const server = app.listen(PORT, () => {
    // mongodb connection
    connectDB()
    logger.info(
        `App is listening on port: ${PORT} in ${ENVIRONMENT} environment`
    )
})

export const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket: Socket) => {
    console.log(`Connected to client: ${socket.id}`)

    socket.on('message', (message: any) => {
        socket.emit(message)
    })

    socket.on('disconnect', () => {
        console.log(`Disconnected from client`)
    })
})
