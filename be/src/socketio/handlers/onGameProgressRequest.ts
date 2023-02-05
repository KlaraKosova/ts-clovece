import { ObjectId } from "mongodb";
import { Server } from "socket.io";
import Client from "../../core/db/Client";
import { GameProgressDocument } from "../../types";
import { SocketIO } from "../types";

export default async function (io: Server, socket: SocketIO) {
    console.log('Socket: onGameProgressRequest');

    console.log(socket.data)
    const client = await Client.getClient()

    const game = await client.collection('games').findOne({
        _id: new ObjectId(socket.data.gameId)
    }) as GameProgressDocument | null

    // console.log(game);
    if (game === null) {
        // TODO
        return
    }
    socket.emit("GAME_PROGRESS_RESPONSE", game)

    console.log('-------------------------')
    console.log(socket.data)
    console.log(game)
    client.disconnect()
}
