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
const helpers_1 = require("../../helpers");
function default_1(socket, data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Socket: on init');
        const client = yield Client_1.default.getClient();
        const games = client.collection('games');
        if (data.gameId && data.userId) {
            const result = yield games.findOne({
                $and: [
                    { _id: new mongodb_1.ObjectId(data.gameId) },
                    {
                        players: {
                            $elemMatch: {
                                token: data.userId
                            }
                        }
                    }
                ]
            });
            if (result) {
                socket.join(data.gameId);
                socket.data.gameId = data.gameId;
                socket.data.userId = data.userId;
                if (result.players.length === 4) {
                    console.log('Socket: emit redirectGameState');
                    socket.emit("GAME_PROGRESS", (0, helpers_1.extractGameInfo)(result, data.userId));
                }
                else {
                    console.log('Socket: emit redirectGameWait');
                    socket.emit("REDIRECT_GAME_WAIT", {
                        gameId: data.gameId,
                        userId: data.userId
                    });
                }
                yield client.disconnect();
                return;
            }
        }
        console.log('Socket: emit RedirectGameSelect');
        socket.emit('REDIRECT_GAME_SELECT');
        yield client.disconnect();
    });
}
exports.default = default_1;
