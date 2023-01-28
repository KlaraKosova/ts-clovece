import { SocketIO } from "../types"
import Client from "../../core/db/Client"
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'
import { Server } from "socket.io";
import { GameProgress, PlayerColors, PlayersOrder } from "../../types";

export default async function (io: Server, socket: SocketIO, data: { name: string }) {
    console.log('Socket: on newGame')
    const client = await Client.getClient()
    const games = client.collection('games')
    const userId = uuidv4()

    const newGame: Omit<GameProgress, "_id" | "lastDiceSequence"> = {
        name: data.name,
        players: 1,
        currentPlayerId: userId,
        playerStatuses: [{
                color: PlayersOrder[0],
                userId: userId,
                figures: [
                    { color: PlayerColors.RED, index: 0, isHome: false, isStart: true },
                    { color: PlayerColors.RED, index: 1, isHome: false, isStart: true },
                    { color: PlayerColors.RED, index: 2, isHome: false, isStart: true },
                    { color: PlayerColors.RED, index: 3, isHome: false, isStart: true },
                ]
            }
        ]
    }

    const result = await games.insertOne(newGame)
    console.log('Socket: emit GameWait')
    await socket.join(result.insertedId.toString())
    socket.emit("REDIRECT_GAME_WAIT", {
        gameId: result.insertedId.toString(),
        userId: userId,
        color: PlayersOrder[0]
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


    io.emit('GAME_SELECT_RESPONSE', { games: response })
    await client.disconnect()
}
