import Client from "../../core/db/Client";
import { ObjectId } from "mongodb";
import {GameProgress, GameProgressDocument, GameProgressUpdate, PlayersOrder, UserInfo} from "../../types";
import { SocketIO } from "../types";
import { Server } from "socket.io";
import {generateDiceSequence, objectCompare} from "../../helpers";

export default async function (io: Server, socket: SocketIO, data: GameProgressUpdate[]) {
    console.log('Socket: on clientGameProgressUpdate')
    console.log(data)
    console.log(socket.data)

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

    const currentPlayerIndex = PlayersOrder.indexOf(socket.data.color!)
    const nextPlayerColor = PlayersOrder[(currentPlayerIndex + 1) % 4]
    const nextPlayer = game.playerStatuses[nextPlayerColor]
    const statuses = game.playerStatuses

    for (let i = 0; i < 4; i++) {
        const color = PlayersOrder[i]
        for (let j = 0; j < 4; j++) {
            for (const move of data) {
                if (objectCompare(statuses[color].figures[j], move.prevField)) {
                    statuses[color].figures[j] = move.nextField
                }
            }
        }
    }

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

    const clients = io.sockets.adapter.rooms.get(socket.data.gameId!)!
    for (const clientId of clients ) {

        //this is the socket of each client in the room.
        const clientSocket = io.sockets.sockets.get(clientId)!;
        console.log('client socket----')
        console.log(clientSocket.data)


    }
    console.log(io.sockets.adapter.rooms.get(socket.data.gameId!)?.size)
    io.to(socket.data.gameId!).emit("GAME_PROGRESS_UPDATE", { progress: updatedGame, updates: data })
    await client.disconnect()
}
