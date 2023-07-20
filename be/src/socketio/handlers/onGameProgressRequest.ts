import { ObjectId } from 'mongodb'
import type { Server } from 'socket.io'
import Client from '../../core/db/Client'
import type { GameProgressDocument } from '../../types'
import type { SocketIO } from '../types'

export default async function (io: Server, socket: SocketIO): Promise<void> {
    console.log('Socket: onGameProgressRequest')

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
    socket.emit('GAME_PROGRESS_RESPONSE', game)

    console.log('-------------------------')
    console.log(socket.data)
    console.log(game)
    await client.disconnect()
}
