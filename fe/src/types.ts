export type UserInfo = {
    userId: string,
    gameId: string
}

export type ViewName = "LOADING" | "GAME_PROGRESS" | "GAME_SELECT" | "GAME_WAITING"

export type Coordinates = { x: number, y: number }

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


export type GamePreview = {
    _id: string
    name: string
    players: number
}