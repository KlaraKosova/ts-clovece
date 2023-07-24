import Client from '../../core/db/Client'
import { ObjectId } from 'mongodb'
import type { ServerIO, SocketIO } from '../types'
import { logger } from '../../core/logger/Logger'
import { SocketDataError } from '../../core/errors/socket/SocketDataError'
import { GameNotFoundError } from '../../core/errors/socket/GameNotFoundError'
import { type GameProgressUpdateDTO } from '../../types/dtos/GameProgressUpdateDTO'
import { PlayersOrder} from '../../types/PlayerColors'
import { type GameProgressDTO } from '../../types/dtos/GameProgressDTO'
import { type GameProgressDocument } from '../../types/GameProgressDocument'
import { Game } from '../../logic/Game'

export default async function (io: ServerIO, socket: SocketIO, updates: GameProgressUpdateDTO[]): Promise<void> {
    logger.socketInfo(socket, 'on clientGameProgressUpdate')
    if (!socket.data || !socket.data.color || !socket.data.userId || !socket.data.gameId) {
        throw new SocketDataError(socket, socket.data)
    }

    const client = await Client.getClient()
    const games = client.collection('games')
    const gameDocument = await games.findOne(new ObjectId(socket.data.gameId)) as GameProgressDocument | null

    if (!gameDocument) {
        throw new GameNotFoundError(socket, socket.data.gameId)
    }
    const game = new Game()
    game.setDTO(gameDocument)

    const lastDiceThrow = gameDocument.lastDiceSequence[gameDocument.lastDiceSequence.length - 1]
    const currentPlayerIndex = PlayersOrder.indexOf(socket.data.color)
    const nextPlayerColor = lastDiceThrow === 6 ? socket.data.color : PlayersOrder[(currentPlayerIndex + 1) % 4]
    const nextPlayer = gameDocument.playerStatuses[nextPlayerColor]
    const statuses = gameDocument.playerStatuses

    const updatesValid = game.validateUpdates(updates)
    if (!updatesValid) {
        io.to(socket.data.gameId).emit('GAME_PROGRESS_UPDATE', { progress: gameDocument, updates: [] })
        await client.disconnect()
        return
    }

    for (const update of updates) {
        const figure = update.figure

        statuses[figure.color].figures[figure.index] = update.nextField
    }

    const updatedData: Partial<GameProgressDTO> = {
        currentPlayerId: nextPlayer.userId,
        playerStatuses: statuses,
        lastDiceSequence: game.generateDiceSequence()
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
