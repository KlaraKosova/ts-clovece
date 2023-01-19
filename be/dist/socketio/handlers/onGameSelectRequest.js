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
exports.onGameSelectRequest = void 0;
const Client_1 = __importDefault(require("../../core/db/Client"));
function onGameSelectRequest(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Socket: onGameSelectRequest");
        const client = yield Client_1.default.getClient();
        const games = client.collection('games');
        const cursor = games.find({
            "playerStatuses.4": {
                $exists: false
            }
        });
        const response = yield cursor.map((game) => {
            return {
                _id: game._id.toString(),
                name: game.name,
                players: Object.keys(game.playerStatuses).length
            };
        }).toArray();
        console.log("Socket: emit gameSelectResponse");
        socket.emit("GAME_SELECT_RESPONSE", { games: response });
        yield client.disconnect();
    });
}
exports.onGameSelectRequest = onGameSelectRequest;
