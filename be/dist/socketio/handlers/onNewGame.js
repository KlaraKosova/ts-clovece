"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("../../core/db/Client"));
// @ts-ignore
const uuid_1 = require("uuid");
const types_1 = require("../../types");
function default_1(socket, data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Socket: on newGame');
        const client = yield Client_1.default.getClient();
        const games = client.collection('games');
        const userId = (0, uuid_1.v4)();
        const newGame = {
            name: data.name,
            currentPlayerIndex: types_1.PlayerColors.RED,
            playerStatuses: {
                [types_1.PlayerColors.RED]: {
                    token: userId,
                    figures: [
                        { playerIndex: types_1.PlayerColors.RED, index: 0, isHome: false, isStart: true },
                        { playerIndex: types_1.PlayerColors.RED, index: 1, isHome: false, isStart: true },
                        { playerIndex: types_1.PlayerColors.RED, index: 2, isHome: false, isStart: true },
                        { playerIndex: types_1.PlayerColors.RED, index: 3, isHome: false, isStart: true },
                    ]
                }
            }
        };
        const result = yield games.insertOne(newGame);
        console.log('Socket: emit GameWait');
        socket.join(result.insertedId.toString());
        socket.emit("REDIRECT_GAME_WAIT", {
            gameId: result.insertedId.toString(),
            userId: userId
        });
        const cursor = games.find({
            players: {
                $not: {
                    $size: 4
                }
            }
        });
        const response = yield cursor.map((game) => {
            return {
                _id: game._id.toString(),
                players: game.players.length
            };
        }).toArray();
        socket.emit('REDIRECT_GAME_SELECT');
        yield client.disconnect();
    });
}
exports.default = default_1;
