import { PlayerColors } from "../types/PlayerColors";
import { GameProgressDTO } from "../types/dtos/GameProgressDTO";
import { locale } from "./locale";

export const PlayerColorNameMap: Record<PlayerColors, string> = {
    [PlayerColors.RED]: locale.get('colors.red'),
    [PlayerColors.BLUE]: locale.get('colors.blue'),
    [PlayerColors.YELLOW]: locale.get('colors.yellow'),
    [PlayerColors.GREEN]: locale.get('colors.green'),
}

export const defaultGameProgressDTO: GameProgressDTO = {
    name: '',
    players: 0,
    lastDiceSequence: [],
    currentPlayerId: '',
    playerStatuses: {
        [PlayerColors.RED]: {
            color: PlayerColors.RED,
            userId: '',
            figures: [
                { index: 0, isStart: true, isHome: false, color: PlayerColors.RED },
                { index: 1, isStart: true, isHome: false, color: PlayerColors.RED },
                { index: 2, isStart: true, isHome: false, color: PlayerColors.RED },
                { index: 3, isStart: true, isHome: false, color: PlayerColors.RED },
            ]
        },
        [PlayerColors.YELLOW]: {
            color: PlayerColors.YELLOW,
            userId: '',
            figures: [
                { index: 0, isStart: true, isHome: false, color: PlayerColors.YELLOW },
                { index: 1, isStart: true, isHome: false, color: PlayerColors.YELLOW },
                { index: 2, isStart: true, isHome: false, color: PlayerColors.YELLOW },
                { index: 3, isStart: true, isHome: false, color: PlayerColors.YELLOW },
            ]
        },
        [PlayerColors.GREEN]: {
            color: PlayerColors.GREEN,
            userId: '',
            figures: [
                { index: 0, isStart: true, isHome: false, color: PlayerColors.GREEN },
                { index: 1, isStart: true, isHome: false, color: PlayerColors.GREEN },
                { index: 2, isStart: true, isHome: false, color: PlayerColors.GREEN },
                { index: 3, isStart: true, isHome: false, color: PlayerColors.GREEN },
            ]
        },
        [PlayerColors.BLUE]: {
            color: PlayerColors.BLUE,
            userId: '',
            figures: [
                { index: 0, isStart: true, isHome: false, color: PlayerColors.BLUE },
                { index: 1, isStart: true, isHome: false, color: PlayerColors.BLUE },
                { index: 2, isStart: true, isHome: false, color: PlayerColors.BLUE },
                { index: 3, isStart: true, isHome: false, color: PlayerColors.BLUE },
            ]
        },
    }
}
