import dotenv from 'dotenv'
dotenv.config()
import http from 'http'
import logger from '@/utilities/logger'

import { Server, Socket } from 'socket.io'
import app from '@/server/server'
export const viteNodeApp = app

const server = http.createServer(app)
// server.listen(process.env.PORT || 5000)

export const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket: Socket) => {
    logger.info(`Connected to client: ${socket.id}`)

    socket.on('message', (message: string) => {
        socket.emit(message)
    })

    socket.on('new-post', () => {
        socket.emit('New Post Added!!')
    })

    socket.on('disconnect', () => {
        logger.info(`Disconnected from client`)
    })
})
