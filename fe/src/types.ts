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
    LOADING: 'LOADING',
    DICE: 'DICE',// vychozi stav kostky pred animaci
    DICE_ANIMATION: 'DICE_ANIMATION',// animace kostky
    DICE_PLAY_BUTTON: 'DICE_PLAY_BUTTON',// zobrazeni play btn
    NO_MOVES_MODAL: 'NO_MOVES_MODAL', // zobrazeni modalu
    HIGHLIGHT_ANIMATION: 'HIGHLIGHT_ANIMATION', // highlight moznych tahu
    CURRENT_PLAYER_FIGURE_MOVE_ANIMATION: 'CURRENT_PLAYER_FIGURE_MOVE_ANIMATION', // animace po kliknuti na pole/figurku
    NEXT_PLAYER_FIGURE_MOVE_ANIMATION: 'NEXT_PLAYER_FIGURE_MOVE_ANIMATION' // animace tahu ostatnich hracu
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
