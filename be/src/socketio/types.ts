import { Socket } from 'socket.io'
import { GameProgress, GamePreview, UserInfo } from '../types'

export interface ServerToClientEvents {
    REDIRECT_GAME_SELECT: () => void,
    REDIRECT_GAME_WAIT: (data: UserInfo) => void,
    GAME_SELECT_RESPONSE: (data: { games: GamePreview[] }) => void,

    // GAME_PROGRESS: (data: GameProgress) => void
}

export interface ClientToServerEvents {
    INIT: (data: UserInfo | null) => void,
    GAME_SELECT_REQUEST: () => void,
    NEW_GAME: (data: { name: string }) => void,
    JOIN_GAME: (data: { gameId: string }) => void,
    // CLIENT_GAME_UPDATE: (data: FieldNumber[][]) => void
}

interface InterServerEvents {
}

interface SocketData {
    gameId: string,
    userId: string
}

export type SocketIO = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
