import type { SocketIO } from '../types'
import Client from '../../core/db/Client'
import { v4 as uuidv4 } from 'uuid'
import type { Server } from 'socket.io'
import { logger } from '../../core/logger/Logger'
import {GameProgressDTO} from "../../types/dtos/GameProgressDTO";
import {PlayerColors, PlayersOrder} from "../../types/PlayerColors";

export default async function (io: Server, socket: SocketIO, data: { name: string }): Promise<void> {
    logger.socketInfo(socket, 'on newGame', data)
    const client = await Client.getClient()
    const games = client.collection('games')
    const userId = uuidv4()

    // @ts-ignore
    const newGame: Omit<GameProgressDTO, '_id' | 'lastDiceSequence'> = {
        name: data.name,
        players: 1,
        currentPlayerId: userId,
        // @ts-ignore
        playerStatuses: {
            [PlayerColors.RED]: {
                color: PlayersOrder[0],
                userId,
                figures: [
                    { color: PlayerColors.RED, index: 0, isHome: false, isStart: true },
                    { color: PlayerColors.RED, index: 1, isHome: false, isStart: true },
                    { color: PlayerColors.RED, index: 2, isHome: false, isStart: true },
                    { color: PlayerColors.RED, index: 3, isHome: false, isStart: true }
                ]
            }
        }
    }

    const result = await games.insertOne(newGame)
    socket.data = {
        color: PlayerColors.RED,
        gameId: result.insertedId.toString(),
        userId
    }

    logger.socketInfo(socket, 'emit gameWait', {
        gameId: result.insertedId.toString(),
        userId,
        color: PlayersOrder[0],
        players: 1
    })

    await socket.join(result.insertedId.toString())
    socket.emit('REDIRECT_GAME_WAIT', {
        gameId: result.insertedId.toString(),
        userId,
        color: PlayersOrder[0],
        players: 1
    })

    const cursor = games.find({
        players: {
            $lt: 4
        }
    })
    const response = await cursor.map((game) => {
        return {
            _id: game._id.toString(),
            name: game.name,
            players: Object.keys(game.playerStatuses).length
        }
    }).toArray()

    logger.socketInfo(socket, 'emit gameSelectResponse', { games: response })
    io.emit('GAME_SELECT_RESPONSE', { games: response })
    await client.disconnect()
}
