import { ObjectId } from 'mongodb'
import type { Server } from 'socket.io'
import Client from '../../core/db/Client'
import type { GameProgressDocument } from '../../types'
import type { SocketIO } from '../types'
import { logger } from '../../core/logger/Logger'
import { SocketDataError } from '../../core/errors/socket/SocketDataError'
import { GameNotFoundError } from '../../core/errors/socket/GameNotFoundError'

export default async function (io: Server, socket: SocketIO): Promise<void> {
    // console.log('Socket: onGameProgressRequest')
    logger.socketInfo(socket, 'on gameProgressRequest')

    if (!socket.data.gameId) {
        throw new SocketDataError(socket, socket.data)
    }

    const client = await Client.getClient()

    const game = await client.collection('games').findOne({
        _id: new ObjectId(socket.data.gameId)
    }) as GameProgressDocument | null

    if (game === null) {
        throw new GameNotFoundError(socket, socket.data.gameId)
    }

    logger.socketInfo(socket, 'emit gameProgressResponse', game)
    socket.emit('GAME_PROGRESS_RESPONSE', game)
    await client.disconnect()
}
