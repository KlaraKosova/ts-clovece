import { Socket, Server } from "socket.io";
import { SocketIO } from "./types";
import Client from "../core/db/Client";
import { ObjectId, WithId } from "mongodb";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'
import onInit from "./handlers/onInit";
import onJoinGame from "./handlers/onJoinGame";
import onNewGame from "./handlers/onNewGame";
import onClientGameProgressUpdate from "./handlers/onClientGameProgressUpdate";
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

    socket.on("GAME_SELECT_REQUEST", () => {
        onGameSelectRequest(io, socket)
    })
    socket.on("GAME_PROGRESS_REQUEST", () => {
        onGameProgressRequest(io, socket)
    })

    socket.on("CLIENT_GAME_PROGRESS_UPDATE", (data) => {
        onClientGameProgressUpdate(io, socket, data)
    })
});


export default io;
