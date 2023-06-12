import Client from "../../core/db/Client";
import { ObjectId } from "mongodb";
import { GameProgress, GameProgressDocument, GameProgressUpdate, PlayersOrder, UserInfo } from "../../types";
import { ServerIO, SocketIO } from "../types";
import { Server } from "socket.io";
import { generateDiceSequence, objectCompare } from "../../helpers";

export default async function (io: ServerIO, socket: SocketIO, updates: GameProgressUpdate[]) {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!Socket: on clientGameProgressUpdate')
    // console.log(data)
    // console.log(socket.data)
    if (!socket.data) {
        return
    }

    const client = await Client.getClient()
    const games = client.collection('games')
    const game = await games.findOne(new ObjectId(socket.data.gameId)) as GameProgressDocument | null
    if (!game) {
        // TODO
        return
    }

    console.log(socket.data)
    const lastDiceThrow = game.lastDiceSequence[game.lastDiceSequence.length - 1]
    const currentPlayerIndex = PlayersOrder.indexOf(socket.data.color!)
    const nextPlayerColor = lastDiceThrow === 6? socket.data.color! : PlayersOrder[(currentPlayerIndex + 1) % 4]
    const nextPlayer = game.playerStatuses[nextPlayerColor]
    const statuses = game.playerStatuses

    console.log('currentPlayerIndex', currentPlayerIndex)
    console.log('nextPlayerColor', nextPlayerColor)
    console.log('nextPlayer', nextPlayer)
    console.log('updates', updates)


    const reversedUpdates = [...updates].reverse()
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
        const figure = updatedGame.playerStatuses[socket.data.color!].figures[i]
        if (!figure.isHome) {
            winner = false
        }
    }
    if (winner) {
        console.log("!!!!!!!!!!!!!!! WINNER !!!!!!!!!!!!!!!!!!!!");
        console.log(socket.data.userId, socket.data.color);

        socket.to(socket.data.gameId!).emit("GAME_WINNER", { winnerId: socket.data.userId! })
        await client.disconnect()
        return
    }

    io.to(socket.data.gameId!).emit("GAME_PROGRESS_UPDATE", { progress: updatedGame, updates: updates })
    await client.disconnect()
}
