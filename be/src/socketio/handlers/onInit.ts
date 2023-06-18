import Client from "../../core/db/Client";
import { ObjectId } from "mongodb";
import { GameProgressDocument, UserInfo } from "../../types";
import {ServerIO, SocketIO} from "../types";
import { Server } from "socket.io";

export default async function (io: ServerIO, socket: SocketIO, data: UserInfo | null) {
    console.log('Socket: on init')
    // console.log(data)

    const client = await Client.getClient()
    const games = client.collection('games')

    if (data && data.gameId && data.userId && data.color) {
        const result = await games.findOne({
            $and: [
                { _id: new ObjectId(data.gameId) },
                {
                    [`playerStatuses.${data.color}.userId`]: { $eq: data.userId}
                },
            ]
        }) as GameProgressDocument | null

        if (result) {
            socket.join(data.gameId)
            socket.data.gameId = data.gameId
            socket.data.userId = data.userId
            socket.data.color = data.color

            if (result.players === 4) {
                console.log('Socket: emit redirectGameState')
                socket.emit("REDIRECT_GAME_PROGRESS")
            } else {
                console.log('Socket: emit redirectGameWait')
                socket.emit("REDIRECT_GAME_WAIT", { ...data, players: result.players})
            }
            await client.disconnect()
            return
        }
    }


    console.log('Socket: emit RedirectGameSelect')
    socket.emit('REDIRECT_GAME_SELECT')
    await client.disconnect()
}
