export const PlayerColors = {
    RED: '0',
    YELLOW: '1',
    GREEN: '2',
    BLUE: '3'
} as const

export type PlayerIndex = typeof PlayerColors[keyof typeof PlayerColors]
export type FieldInfo = {
    index: number,
    isStart: boolean,
    isHome: boolean,
    playerIndex: PlayerIndex | null
}

export type PlayerStatus = {
    token: string
    figures: FieldInfo[]
}

export type GameProgress = {
    _id: string
    name: string
    playerStatuses: Partial<Record<PlayerIndex, PlayerStatus>>
    lastDiceSequence: number[]
    currentPlayerIndex: PlayerIndex
}

export type GamePreview = {
    _id: string
    name: string
    players: number
}

export type UserInfo = {
    userId: string,
    gameId: string
}