import { Socket } from 'socket.io-client'
import {UserInfo, GamePreview, GameProgress, GameProgressUpdate} from '../types'

// redirect_ eventy se resi primo v App, ostatni v samostatnych funkcich
export interface ServerToClientEvents {
    REDIRECT_GAME_SELECT: () => void,
    REDIRECT_GAME_WAIT: (data: UserInfo) => void,
    GAME_SELECT_RESPONSE: (data: { games: GamePreview[] }) => void,
    REDIRECT_GAME_PROGRESS: () => void,
    GAME_PROGRESS_RESPONSE: (data: GameProgress) => void,
    GAME_PROGRESS_UPDATE: (data: { progress: GameProgress, updates: GameProgressUpdate[] }) => void,
    GAME_WINNER: (data: { winnerId: string }) => void
}

export interface ClientToServerEvents {
    INIT: (data: UserInfo | null) => void,
    GAME_SELECT_REQUEST: () => void,
    NEW_GAME: (data: { name: string }) => void,
    JOIN_GAME: (data: { gameId: string }) => void,
    GAME_PROGRESS_REQUEST: () => void,
    CLIENT_GAME_PROGRESS_UPDATE: (data: GameProgressUpdate[]) => void,
    NEXT_PLAYER_MOVE: () => void
}

export type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>
