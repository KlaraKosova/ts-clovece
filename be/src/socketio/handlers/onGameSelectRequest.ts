import { Server } from "socket.io";
import Client from "../../core/db/Client";
import { PlayerColors } from "../../types";
import { SocketIO } from "../types";

export async function onGameSelectRequest(io: Server, socket: SocketIO) {
    console.log("Socket: onGameSelectRequest");

    const client = await Client.getClient()
    const games = client.collection('games')

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

    console.log("Socket: emit gameSelectResponse");

    socket.emit("GAME_SELECT_RESPONSE", { games: response })
    await client.disconnect()

}