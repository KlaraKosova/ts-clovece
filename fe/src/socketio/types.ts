import { Socket } from 'socket.io-client'
import { UserInfo, GamePreview, GameProgress } from '../types'

// redirect_ eventy se resi primo v App, ostatni v samostatnych funkcich
export interface ServerToClientEvents {
    REDIRECT_GAME_SELECT: () => void,
    REDIRECT_GAME_WAIT: (data: UserInfo) => void,
    GAME_SELECT_RESPONSE: (data: { games: GamePreview[] }) => void,
    REDIRECT_GAME_PROGRESS: () => void,
    GAME_PROGRESS_RESPONSE: (data: GameProgress) => void
}

export interface ClientToServerEvents {
    INIT: (data: UserInfo | null) => void,
    GAME_SELECT_REQUEST: () => void,
    NEW_GAME: (data: { name: string }) => void,
    JOIN_GAME: (data: { gameId: string }) => void,
    GAME_PROGRESS_REQUEST: () => void
}

export type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>
