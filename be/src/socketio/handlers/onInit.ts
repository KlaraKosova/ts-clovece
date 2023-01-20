import Client from "../../core/db/Client";
import { ObjectId } from "mongodb";
import { GameDocument } from "../../db/types/Game";
import { UserInfo } from "../../types";
import { SocketIO } from "../types";
import { extractGameInfo } from "../../helpers";

export default async function (socket: SocketIO, data: UserInfo | null) {
    console.log('Socket: on init')

    const client = await Client.getClient()
    const games = client.collection('games')

    if (data && data.gameId && data.userId) {
        const result = await games.findOne({
            $and: [
                { _id: new ObjectId(data.gameId) },
                {
                    players: {
                        $elemMatch: {
                            token: data.userId
                        }
                    }
                }
            ]
        }) as GameDocument | null

        if (result) {
            socket.join(data.gameId)
            socket.data.gameId = data.gameId
            socket.data.userId = data.userId

            if (result.players.length === 4) {
                console.log('Socket: emit redirectGameState')
                // socket.emit("GAME_PROGRESS", extractGameInfo(result, data.userId))
            } else {
                console.log('Socket: emit redirectGameWait')
                socket.emit("REDIRECT_GAME_WAIT", {
                    gameId: data.gameId,
                    userId: data.userId
                })
            }
            await client.disconnect()
            return
        }
    }


    console.log('Socket: emit RedirectGameSelect')
    socket.emit('REDIRECT_GAME_SELECT')
    await client.disconnect()
}
