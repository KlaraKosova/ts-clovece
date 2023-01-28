import { Socket, Server } from "socket.io";
import { SocketIO } from "./types";
import Client from "../core/db/Client";
import { ObjectId, WithId } from "mongodb";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'
import onInit from "./handlers/onInit";
import onJoinGame from "./handlers/onJoinGame";
import onNewGame from "./handlers/onNewGame";
import onClientGameUpdate from "./handlers/onClientGameUpdate";
import { onGameSelectRequest } from "./handlers/onGameSelectRequest";
import onGameProgressRequest from "./handlers/onGameProgressRequest";

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
        onInit(io, socket, data)
    })

    socket.on('NEW_GAME', data => {
        onNewGame(io, socket, data)
    })
    socket.on('JOIN_GAME', data => {
        onJoinGame(io, socket, data)
    })

    /* socket.on('CLIENT_GAME_UPDATE', data => {
        onClientGameUpdate(socket, data)
    }) */

    socket.on("GAME_SELECT_REQUEST", () => {
        onGameSelectRequest(io, socket)
    })
    socket.on("GAME_PROGRESS_REQUEST", () => {
        onGameProgressRequest(io, socket)
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
