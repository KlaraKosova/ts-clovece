"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDiceSequence = exports.extractGameInfo = void 0;
function extractGameInfo(game, userId) {
    return {
        _id: game._id.toString(),
        playerIndex: game.players.findIndex((player) => player.token === userId),
        players: game.players
            .map((player) => ({ figurePositions: player.figurePositions })),
        lastDiceSequence: game.lastDiceSequence,
        currentRoundPlayerIndex: game.currentRoundPlayerIndex
    };
}
exports.extractGameInfo = extractGameInfo;
function generateDiceSequence() {
    let result = [];
    for (let i = 0; i < 50; i++) {
        let next;
        do {
            next = Math.round(Math.random() * 5) + 1;
        } while (i !== 0 && next === result[i - 1]);
        result.push(next);
    }
    return result;
}
exports.generateDiceSequence = generateDiceSequence;
