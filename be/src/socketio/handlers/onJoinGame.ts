import {SocketIO} from "../types"
import Client from "../../core/db/Client"
import {ObjectId} from "mongodb"
// @ts-ignore
import {v4 as uuidv4} from 'uuid'
import {GameDocument} from "../../db/types/Game"
import {extractGameInfo, generateDiceSequence} from "../../helpers";

export default async function (socket: SocketIO, data: { gameId: string }) {
    console.log('Socket: on joinGame')
    const client = await Client.getClient()
    const games = client.collection('games')
    const userId = uuidv4()

    const game = await games.findOne({
        _id: new ObjectId(data.gameId)
    }) as GameDocument | null
    if (!game) {
        // TODO
        return
    }

    let lastDiceSequence = [] as number[]
    if (game.players.length === 3) {
        lastDiceSequence = generateDiceSequence()
    }

    await games.updateOne({
            _id: new ObjectId(data.gameId)
        },
        {
            $push: {
                players: {
                    token: userId,
                    figurePositions: [
                        `S${game.players.length}_0`,
                        `S${game.players.length}_1`,
                        `S${game.players.length}_2`,
                        `S${game.players.length}_3`
                    ]
                }
            },
            $set: {
                lastDiceSequence
            }
        }
    )
    const updatedGame = await games.findOne({
        _id: new ObjectId(data.gameId)
    }) as GameDocument

    await socket.join(data.gameId)
    socket.data.gameId = data.gameId
    socket.data.userId = userId

    console.log('Socket: emit GameWait')
    socket.emit("GAME_WAIT", {
        gameId: data.gameId,
        userId: userId
    })
    if (updatedGame.players.length === 4) {
        console.log('Socket: emit GameProgress')
        const result = extractGameInfo(updatedGame, userId)
        socket.emit("GAME_PROGRESS", result)
        socket.to(data.gameId).emit("GAME_PROGRESS", result)
    }
}
