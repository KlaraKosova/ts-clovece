import {ServerIO, SocketIO} from "../types"
import Client from "../../core/db/Client"
import {ObjectId} from "mongodb"
// @ts-ignore
import {v4 as uuidv4} from 'uuid'
import { generateDiceSequence} from "../../helpers";
import { Server } from "socket.io"
import { GameProgress, GameProgressDocument, PlayerColors, PlayersOrder, PlayerStatus } from "../../types"

export default async function (io: ServerIO, socket: SocketIO, data: { gameId: string }) {
    console.log('Socket: on joinGame')
    const client = await Client.getClient()
    const games = client.collection('games')
    const userId = uuidv4()

    const game = await games.findOne({
        $and: [
            { _id: new ObjectId(data.gameId)},
            { players: { $lt: 4 }}
        ]
    }) as GameProgressDocument | null
    if (!game) {
        // TODO
        return
    }

    let lastDiceSequence = [] as number[]
    if (game.players === 3) {
        // vsichni hraci
        lastDiceSequence = generateDiceSequence()
    }

    const newPlayerColor = PlayersOrder[game.players]
    const newPlayerStatus : PlayerStatus = {
        color: newPlayerColor,
        userId: userId,
        figures: [
            { index: 0, isStart: true, isHome: false, color: newPlayerColor},
            { index: 1, isStart: true, isHome: false, color: newPlayerColor},
            { index: 2, isStart: true, isHome: false, color: newPlayerColor},
            { index: 3, isStart: true, isHome: false, color: newPlayerColor},
        ]
    }

    const updatedStatuses = game.playerStatuses
    updatedStatuses[newPlayerColor] = newPlayerStatus

    await games.updateOne({
            _id: new ObjectId(data.gameId)
        },
        {
            $set: {
                lastDiceSequence,
                players: game.players + 1,
                playerStatuses: updatedStatuses
            },
        }
    )
    const updatedGame = await games.findOne({
        _id: new ObjectId(data.gameId)
    }) as GameProgressDocument

    await socket.join(data.gameId)
    socket.data.gameId = data.gameId
    socket.data.userId = userId
    socket.data.color = newPlayerColor

    console.log('Socket: emit GameWait')
    socket.emit("REDIRECT_GAME_WAIT", {
        gameId: data.gameId,
        userId: userId,
        color: newPlayerColor
    })

    if (updatedGame.players === 4) {
        io.to(data.gameId).emit('REDIRECT_GAME_PROGRESS')
    }

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


    io.emit('GAME_SELECT_RESPONSE', { games: response })
}
