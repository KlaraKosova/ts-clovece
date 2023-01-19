import { Socket } from 'socket.io-client'
import { UserInfo, GamePreview } from '../types'

// redirect_ eventy se resi primo v App, ostatni v samostatnych funkcich
export interface ServerToClientEvents {
    REDIRECT_GAME_SELECT: () => void,
    REDIRECT_GAME_WAIT: (data: UserInfo) => void,
    GAME_SELECT_RESPONSE: (data: { games: GamePreview[] }) => void,

    // GAME_PROGRESS: (data: GameProgress) => void
}

export interface ClientToServerEvents {
    INIT: (data: { gameId: string | null, userId: string | null }) => void,
    GAME_SELECT_REQUEST: () => void,
    NEW_GAME: (data: { name: string }) => void,
    JOIN_GAME: (data: { gameId: string }) => void,
    // CLIENT_GAME_UPDATE: (data: FieldNumber[][]) => void
}

export type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>
