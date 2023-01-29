export interface UserInfo {
    userId: string,
    gameId: string,
    color: PlayerColor
}

export type ViewName = "LOADING" | "GAME_PROGRESS" | "GAME_SELECT" | "GAME_WAITING"

export type Coordinates = { x: number, y: number }

export const PlayerColors = {
    RED: '0',
    YELLOW: '1',
    GREEN: '2',
    BLUE: '3'
} as const

export type PlayerColor = typeof PlayerColors[keyof typeof PlayerColors]
export const PlayersOrder = [PlayerColors.RED, PlayerColors.YELLOW, PlayerColors.GREEN, PlayerColors.BLUE] as const

export const SvgBoardStates = {
    BEFORE_LOAD: '0',
    DEFAULT: '1',
    DICE: '2',
    DICE_ANIMATION: '3',
    DICE_PLAY_BTN: '4',
    HIGHLIGHT_FIELDS: '5',
    FIGURE_SELECTED: '6',
    FIGURE_MOVE: '7',
    ANIMATING: '8',
    SENDING_DATA: '9'
} as const
export type SvgBoardStates = typeof SvgBoardStates[keyof typeof SvgBoardStates]

export interface FieldInfo {
    index: number,
    isStart: boolean,
    isHome: boolean,
    color: PlayerColor | null
}

export interface GamePreview {
    _id: string
    name: string
    players: number
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

export interface DocumentClickData {
    field: FieldInfo | null
    figure: string
    dice: boolean
    playButton: boolean
}
