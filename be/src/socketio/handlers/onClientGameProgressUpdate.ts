import Client from '../../core/db/Client'
import { ObjectId } from 'mongodb'
import { type GameProgress, type GameProgressDocument, type GameProgressUpdate, PlayersOrder } from '../../types'
import type { ServerIO, SocketIO } from '../types'
import { generateDiceSequence } from '../../helpers'
import { logger } from '../../core/logger/Logger'
import { SocketDataError } from '../../core/errors/socket/SocketDataError'
import { GameNotFoundError } from '../../core/errors/socket/GameNotFoundError'

export default async function (io: ServerIO, socket: SocketIO, updates: GameProgressUpdate[]): Promise<void> {
    // console.log('Socket: on clientGameProgressUpdate')
    logger.socketInfo(socket, 'on clientGameProgressUpdate')
    if (!socket.data || !socket.data.color || !socket.data.userId || !socket.data.gameId) {
        throw new SocketDataError(socket, socket.data)
    }

    const client = await Client.getClient()
    const games = client.collection('games')
    const game = await games.findOne(new ObjectId(socket.data.gameId)) as GameProgressDocument | null

    if (!game) {
        throw new GameNotFoundError(socket, socket.data.gameId)
    }

    const lastDiceThrow = game.lastDiceSequence[game.lastDiceSequence.length - 1]
    const currentPlayerIndex = PlayersOrder.indexOf(socket.data.color)
    const nextPlayerColor = lastDiceThrow === 6 ? socket.data.color : PlayersOrder[(currentPlayerIndex + 1) % 4]
    const nextPlayer = game.playerStatuses[nextPlayerColor]
    const statuses = game.playerStatuses

    for (const update of updates) {
        const figure = update.figure

        statuses[figure.color].figures[figure.index] = update.nextField
    }
    /* for (let i = 0; i < 4; i++) {
        const color = PlayersOrder[i]
        for (let j = 0; j < 4; j++) {
            for (const move of reversedUpdates) {
                if (objectCompare(statuses[color].figures[j], move.prevField)) {
                    statuses[color].figures[j] = move.nextField
                }
            }
        }
    } */

    const updatedData: Partial<GameProgress> = {
        currentPlayerId: nextPlayer.userId,
        playerStatuses: statuses,
        lastDiceSequence: generateDiceSequence()
    }
    await games.updateOne({
        _id: new ObjectId(socket.data.gameId)
    }, {
        $set: updatedData
    })
    const updatedGame = await games.findOne({
        _id: new ObjectId(socket.data.gameId)
    }) as GameProgressDocument

    let winner = true
    for (let i = 0; i < 4; i++) {
        const figure = updatedGame.playerStatuses[socket.data.color].figures[i]
        if (!figure.isHome) {
            winner = false
        }
    }
    if (winner) {
        logger.socketInfo(socket, 'emit gameWinner', { winnerId: socket.data.userId })

        io.to(socket.data.gameId).emit('GAME_WINNER', { winnerId: socket.data.userId })
        await client.disconnect()
        return
    }

    io.to(socket.data.gameId).emit('GAME_PROGRESS_UPDATE', { progress: updatedGame, updates })
    await client.disconnect()
}
