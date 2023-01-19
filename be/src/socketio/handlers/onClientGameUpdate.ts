import {FieldNumber} from "../../types";
import {SocketIO} from "../types";
import Client from "../../core/db/Client";
import {extractGameInfo, generateDiceSequence} from "../../helpers";
import {ObjectId} from "mongodb";
import {GameDocument} from "../../db/types/Game";

export default async function (socket: SocketIO, data: FieldNumber[][]) {
    console.log('Socket: on clientGameUpdate')
    const client = await Client.getClient()
    const games = client.collection('games')
    const game = await games.findOne({
        _id: new ObjectId(socket.data.gameId)
    })  as GameDocument | null
    if (!game || !socket.data.gameId || !socket.data.userId) {
        // TODO
        throw new Error()
    }
    console.log(socket)

    const newLastDiceSequence = generateDiceSequence()
    const newCurrentRoundPlayerIndex = game.currentRoundPlayerIndex === 3 ? 0 : game.currentRoundPlayerIndex + 1
    const newPlayers = []
    for (let i = 0; i < 4; i++) {
        newPlayers[i] = {
            token: game.players[i].token,
            figurePositions: data[i]
        }
    }

    await games.updateOne({
            _id: new ObjectId(socket.data.gameId)
        },
        {
            $set: {
                lastDiceSequence: newLastDiceSequence,
                currentRoundPlayerIndex: newCurrentRoundPlayerIndex,
                players: newPlayers
            }
        }
    )

    const updatedGame = await games.findOne({
        _id: game._id
    }) as GameDocument

    const result = extractGameInfo(updatedGame, socket.data.userId)
    socket.to(game._id.toString()).emit("GAME_PROGRESS", result)
}
