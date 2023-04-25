import { Socket } from 'socket.io-client'
import { UserInfo } from '../types/common/UserInfo'
import { GamePreview } from '../types/data/GamePreview'
import { GameProgressDataset } from '../types/data/GameProgressDataset'
import { GameProgressUpdate } from '../types/data/GameProgressUpdate'

// redirect_ eventy se resi primo v App, ostatni v samostatnych funkcich
export interface ServerToClientEvents {
    REDIRECT_GAME_SELECT: () => void,
    REDIRECT_GAME_WAIT: (data: UserInfo) => void,
    GAME_SELECT_RESPONSE: (data: { games: GamePreview[] }) => void,
    REDIRECT_GAME_PROGRESS: () => void,
    GAME_PROGRESS_RESPONSE: (data: GameProgressDataset) => void,
    GAME_PROGRESS_UPDATE: (data: { progress: GameProgressDataset, updates: GameProgressUpdate[] }) => void,
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
