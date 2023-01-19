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
const mongodb_1 = require("mongodb");
// @ts-ignore
const uuid_1 = require("uuid");
const helpers_1 = require("../../helpers");
function default_1(socket, data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Socket: on joinGame');
        const client = yield Client_1.default.getClient();
        const games = client.collection('games');
        const userId = (0, uuid_1.v4)();
        const game = yield games.findOne({
            _id: new mongodb_1.ObjectId(data.gameId)
        });
        if (!game) {
            // TODO
            return;
        }
        let lastDiceSequence = [];
        if (game.players.length === 3) {
            lastDiceSequence = (0, helpers_1.generateDiceSequence)();
        }
        yield games.updateOne({
            _id: new mongodb_1.ObjectId(data.gameId)
        }, {
            $push: {
                players: {
                    token: userId,
                    figurePositions: [
                        `S${game.players.length}_0`,
                        `S${game.players.length}_1`,
                        `S${game.players.length}_2`,
                        `S${game.players.length}_3`
                    ]
                }
            },
            $set: {
                lastDiceSequence
            }
        });
        const updatedGame = yield games.findOne({
            _id: new mongodb_1.ObjectId(data.gameId)
        });
        yield socket.join(data.gameId);
        socket.data.gameId = data.gameId;
        socket.data.userId = userId;
        console.log('Socket: emit GameWait');
        socket.emit("GAME_WAIT", {
            gameId: data.gameId,
            userId: userId
        });
        if (updatedGame.players.length === 4) {
            console.log('Socket: emit GameProgress');
            const result = (0, helpers_1.extractGameInfo)(updatedGame, userId);
            socket.emit("GAME_PROGRESS", result);
            socket.to(data.gameId).emit("GAME_PROGRESS", result);
        }
    });
}
exports.default = default_1;
