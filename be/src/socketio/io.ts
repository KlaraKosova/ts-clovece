import { Socket, Server } from "socket.io";
import { SocketIO } from "./types";
import Client from "../core/db/Client";
import { ObjectId, WithId } from "mongodb";
import { GameDocument } from "../db/types/Game";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'
import onInit from "./handlers/onInit";
import onJoinGame from "./handlers/onJoinGame";
import onNewGame from "./handlers/onNewGame";
import onClientGameUpdate from "./handlers/onClientGameUpdate";
import { onGameSelectRequest } from "./handlers/onGameSelectRequest";

const io = new Server<SocketIO>(3001, {
    path: '/',
    cors: {
        origin: '*'
    }
});

io.on("connection", (socket: SocketIO) => {
    console.log('Socket: connected');

    socket.on('disconnect', () => {
        console.log('Socket: disconnected')
    })

    socket.on('INIT', data => {
        onInit(socket, data)
    })

    /* socket.on("INIT", async (data) => {
        console.log('Socket: on init')

        const client = await Client.getClient()
        const games = client.collection('games')
        if (data.gameId && data.userId) {
            const result = await games.findOne({
                $and: [
                    {_id: new ObjectId(data.gameId)},
                    {
                        players: {
                            $elemMatch: {
                                token: data.userId
                            }
                        }
                    }
                ]
            }) as GameDocument | null

            console.log(result)
            if (!result) {
                console.log('Socket: emit GameSelect')
                const cursor = games.find({
                    players: {
                        $not: {
                            $size: 4
                        }
                    }
                })
                const response = await cursor.map((game) => {
                    return {
                        _id: game._id.toString(),
                        playersCount: game.players.length
                    }

                }).toArray()

                socket.emit('GAME_SELECT', response)
            } else {
                socket.join(data.gameId)
                if (result.players.length === 4) {
                    console.log('Socket: emit redirectGameState')
                    // socket.emit("redirectGameState")
                } else {
                    console.log('Socket: emit redirectGameWait')
                    socket.emit("GAME_WAIT", {
                        gameId: data.gameId,
                        userId: data.userId
                    })
                }

            }
            client.disconnect()
            return
        }

        client.disconnect()
        console.log('Socket: emit redirectGameSelect')
        socket.emit("redirectGameSelect")
    }) */
    /* socket.on('newGame', async () => {
        console.log('Socket: on newGame')
        const client = await Client.getClient()
        const games = client.collection('games')
        const userId = uuidv4()

        const result = await games.insertOne({
            players: [
                {
                    token: userId,
                    figurePositions: ['H0', 'H1', 'H2', 'H3']
                }
            ]
        })
        console.log('Socket: emit redirectGameWait')
        socket.join(result.insertedId.toString())
        socket.emit("GAME_WAIT", {
            gameId: result.insertedId.toString(),
            userId: userId
        })
    }) */

    socket.on('NEW_GAME', () => {
        onNewGame(io, socket)
    })
    socket.on('JOIN_GAME', data => {
        onJoinGame(socket, data)
    })

    socket.on('CLIENT_GAME_UPDATE', data => {
        onClientGameUpdate(socket, data)
    })

    socket.on("GAME_SELECT_REQUEST", () => {
        onGameSelectRequest(socket)
    })
    /* socket.on('joinGame', async data => {
        console.log('Socket: on joinGame')
        const client = await Client.getClient()
        const games = client.collection('games')
        const userId = uuidv4()

        const game = await games.findOne({
            _id: new ObjectId(data.gameId)
        }) as GameDocument | null
        if (!game) {
            return
        }
        await games.updateOne({
                _id: new ObjectId(data.gameId)
            },
            {
                $push: {
                    players: {
                        token: userId,
                        figurePositions: ['H0', 'H1', 'H2', 'H3']
                    }
                }
            }
        )
        await socket.join(data.gameId)

        console.log('Socket: emit redirectGameWait')
        socket.emit("GAME_WAIT", {
            gameId: data.gameId,
            userId: userId
        })
        if (game.players.length === 3) {
            console.log('Socket: emit redirectGameState')
            socket.emit("GAME_PROGRESS")
            socket.to(data.gameId).emit("GAME_PROGRESS")
        }
    }) */
});


export default io;
