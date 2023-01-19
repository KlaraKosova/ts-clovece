import Client from "../../core/db/Client";
import { SocketIO } from "../types";

export async function onGameSelectRequest(socket: SocketIO) {
    console.log("Socket: onGameSelectRequest");

    const client = await Client.getClient()
    const games = client.collection('games')

    const cursor = games.find({
        "playerStatuses.4": {
            $exists: false
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