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
const helpers_1 = require("../../helpers");
const mongodb_1 = require("mongodb");
function default_1(socket, data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Socket: on clientGameUpdate');
        const client = yield Client_1.default.getClient();
        const games = client.collection('games');
        const game = yield games.findOne({
            _id: new mongodb_1.ObjectId(socket.data.gameId)
        });
        if (!game || !socket.data.gameId || !socket.data.userId) {
            // TODO
            throw new Error();
        }
        console.log(socket);
        const newLastDiceSequence = (0, helpers_1.generateDiceSequence)();
        const newCurrentRoundPlayerIndex = game.currentRoundPlayerIndex === 3 ? 0 : game.currentRoundPlayerIndex + 1;
        const newPlayers = [];
        for (let i = 0; i < 4; i++) {
            newPlayers[i] = {
                token: game.players[i].token,
                figurePositions: data[i]
            };
        }
        yield games.updateOne({
            _id: new mongodb_1.ObjectId(socket.data.gameId)
        }, {
            $set: {
                lastDiceSequence: newLastDiceSequence,
                currentRoundPlayerIndex: newCurrentRoundPlayerIndex,
                players: newPlayers
            }
        });
        const updatedGame = yield games.findOne({
            _id: game._id
        });
        const result = (0, helpers_1.extractGameInfo)(updatedGame, socket.data.userId);
        socket.to(game._id.toString()).emit("GAME_PROGRESS", result);
    });
}
exports.default = default_1;
