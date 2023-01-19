import {GameDocument, Player} from "./db/types/Game";
import {FieldNumber, GameProgress, PlayerIndex} from "./types";

export function extractGameInfo(game: GameDocument, userId: string): GameProgress {
    return {
        _id: game._id.toString(),
        playerIndex: game.players.findIndex((player: Player): boolean => player.token === userId) as PlayerIndex,
        players: game.players
            .map((player: Player): { figurePositions: FieldNumber[] } => ({figurePositions: player.figurePositions})),
        lastDiceSequence: game.lastDiceSequence,
        currentRoundPlayerIndex: game.currentRoundPlayerIndex
    }
}

export function generateDiceSequence(): number[] {
    let result = [] as number[]
    for (let i = 0; i < 50; i++) {
        let next
        do {
            next = Math.round(Math.random() * 5) + 1
        } while (i !== 0 && next === result[i - 1])
        result.push(next)
    }

    return result
}
