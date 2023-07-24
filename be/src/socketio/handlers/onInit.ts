import Client from '../../core/db/Client'
import { ObjectId } from 'mongodb'
import type { ServerIO, SocketIO } from '../types'
import { logger } from '../../core/logger/Logger'
import {UserInfo} from "../../types/UserInfo";
import {GameProgressDocument} from "../../types/GameProgressDocument";

export default async function (io: ServerIO, socket: SocketIO, data: UserInfo | null): Promise<void> {
    logger.socketInfo(socket, 'on init')

    const client = await Client.getClient()
    const games = client.collection('games')

    if (data?.gameId && data?.userId && data?.color) {
        const result = await games.findOne({
            $and: [
                { _id: new ObjectId(data.gameId) },
                {
                    [`playerStatuses.${data.color}.userId`]: { $eq: data.userId }
                }
            ]
        }) as GameProgressDocument | null

        if (result) {
            await socket.join(data.gameId)
            socket.data.gameId = data.gameId
            socket.data.userId = data.userId
            socket.data.color = data.color

            if (result.players === 4) {
                logger.socketInfo(socket, 'emit redirectGameProgress', socket.data)
                socket.emit('REDIRECT_GAME_PROGRESS')
            } else {
                logger.socketInfo(socket, 'emit redirectGameWait', socket.data)
                socket.emit('REDIRECT_GAME_WAIT', { ...data, players: result.players })
            }
            await client.disconnect()
            return
        }
    }

    logger.socketInfo(socket, 'emit eedirectGameSelect')
    socket.emit('REDIRECT_GAME_SELECT')
    await client.disconnect()
}
