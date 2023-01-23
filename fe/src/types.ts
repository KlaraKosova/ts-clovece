export interface UserInfo {
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
export const PlayersOrder = [PlayerColors.RED, PlayerColors.YELLOW, PlayerColors.GREEN, PlayerColors.BLUE] as const

export const SvgBoardStates = {
    DEFAULT: '0',
    DICE: '1',
    DICE_PLAY_BTN: '2',
    HIGHLIGHT_FIELDS: '3',
    FIGURE_SELECTED: '4',
    FIGURE_MOVE: '5',
    ANIMATING: '6',
    SENDING_DATA: '7'
} as const
export type SvgBoardStates = typeof SvgBoardStates[keyof typeof SvgBoardStates]

export interface FieldInfo {
    index: number,
    isStart: boolean,
    isHome: boolean,
    playerIndex: PlayerIndex | null
}

export interface GamePreview {
    _id: string
    name: string
    players: number
}

export interface PlayerStatus {
    color: PlayerIndex
    token: string
    figures: FieldInfo[]
}

export interface GameProgress {
    name: string
    players: number
    playerStatuses: PlayerStatus[]
    lastDiceSequence: number[]
    currentPlayerIndex: PlayerIndex
}