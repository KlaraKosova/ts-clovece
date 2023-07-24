import { Server } from 'socket.io'
import type { SocketIO } from './types'
import onInit from './handlers/onInit'
import onJoinGame from './handlers/onJoinGame'
import onNewGame from './handlers/onNewGame'
import onClientGameProgressUpdate from './handlers/onClientGameProgressUpdate'
import { onGameSelectRequest } from './handlers/onGameSelectRequest'
import onGameProgressRequest from './handlers/onGameProgressRequest'
import { logger } from '../core/logger/Logger'

const io = new Server<SocketIO>(3001, {
    path: '/',
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket: SocketIO) => {
    logger.socketInfo(socket, 'connected')

    socket.on('disconnect', async () => {
        logger.socketInfo(socket, 'disconnected')
    })

    socket.on('INIT', async (data) => {
        await onInit(io, socket, data)
    })

    socket.on('NEW_GAME', async (data) => {
        await onNewGame(io, socket, data)
    })
    socket.on('JOIN_GAME', async (data) => {
        await onJoinGame(io, socket, data)
    })

    socket.on('GAME_SELECT_REQUEST', async() => {
        await onGameSelectRequest(io, socket)
    })
    socket.on('GAME_PROGRESS_REQUEST', async () => {
        await onGameProgressRequest(io, socket)
    })

    socket.on('CLIENT_GAME_PROGRESS_UPDATE', async (data) => {
        await onClientGameProgressUpdate(io, socket, data)
    })
})

export default io
