import { WithId } from "mongodb"

export const PlayerColors = {
    RED: '0',
    YELLOW: '1',
    GREEN: '2',
    BLUE: '3'
} as const

export type PlayerColor = typeof PlayerColors[keyof typeof PlayerColors]
export const PlayersOrder = [PlayerColors.RED, PlayerColors.YELLOW, PlayerColors.GREEN, PlayerColors.BLUE] as const
export interface FieldInfo {
    index: number,
    isStart: boolean,
    isHome: boolean,
    color: PlayerColor | null
}

export interface PlayerStatus {
    color: PlayerColor
    userId: string
    figures: FieldInfo[]
}

export interface GameProgress {
    name: string
    players: number
    playerStatuses: PlayerStatus[]
    lastDiceSequence: number[]
    currentPlayerId: string
}

export interface GameProgressDocument extends WithId<Document>, GameProgress {
}

export interface GamePreview {
    _id: string
    name: string
    players: number
}

export interface UserInfo {
    userId: string,
    gameId: string,
    color: PlayerColor
}
