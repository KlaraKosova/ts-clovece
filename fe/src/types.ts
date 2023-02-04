import {Field} from "./svgElements/Field";

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
    DICE: '2', // vychozi stav kostky pred animaci
    DICE_ANIMATION: '3', // animace kostky
    DICE_PLAY_BTN: '4', // zobrazeni play btn
    HIGHLIGHT_FIELDS: '5',
    FIGURE_SELECTED: '6',
    FIGURE_MOVE: '7',
    GAME_PROGRESS_UPDATE_MOVE: '8', // animace tahu ostatnich hracu
    ANIMATING: '9',
    SENDING_DATA: '10',
    NO_MOVES: '11'

} as const
export type SvgBoardStates = typeof SvgBoardStates[keyof typeof SvgBoardStates]

export interface FieldDataset {
    index: number,
    isStart: boolean,
    isHome: boolean,
    color: PlayerColor | null
}

export interface FigureDataset {
    index: number,
    color: PlayerColor
}

export interface GamePreview {
    _id: string
    name: string
    players: number
}

export interface PlayerStatus {
    color: PlayerColor
    userId: string
    figures: FieldDataset[]
}

export interface GameProgress {
    name: string
    players: number
    playerStatuses: Record<PlayerColor, PlayerStatus>
    lastDiceSequence: number[]
    currentPlayerId: string
}

export interface DocumentClickData {
    field: FieldDataset | null
    figure: FigureDataset | null
    dice: boolean
    playButton: boolean
    nextPlayerButton: boolean
}

export interface GameProgressUpdate {
    type: 'MOVE' | 'KICK',
    prevField: FieldDataset,
    nextField: FieldDataset
}
