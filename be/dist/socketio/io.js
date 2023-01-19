"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const onInit_1 = __importDefault(require("./handlers/onInit"));
const onJoinGame_1 = __importDefault(require("./handlers/onJoinGame"));
const onNewGame_1 = __importDefault(require("./handlers/onNewGame"));
const onClientGameUpdate_1 = __importDefault(require("./handlers/onClientGameUpdate"));
const onGameSelectRequest_1 = require("./handlers/onGameSelectRequest");
const io = new socket_io_1.Server(3001, {
    path: '/',
    cors: {
        origin: '*'
    }
});
io.on("connection", (socket) => {
    console.log('Socket: connected');
    socket.on('disconnect', () => {
        console.log('Socket: disconnected');
    });
    socket.on('INIT', data => {
        (0, onInit_1.default)(socket, data);
    });
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
        (0, onNewGame_1.default)(io, socket);
    });
    socket.on('JOIN_GAME', data => {
        (0, onJoinGame_1.default)(socket, data);
    });
    socket.on('CLIENT_GAME_UPDATE', data => {
        (0, onClientGameUpdate_1.default)(socket, data);
    });
    socket.on("GAME_SELECT_REQUEST", () => {
        (0, onGameSelectRequest_1.onGameSelectRequest)(socket);
    });
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
exports.default = io;
