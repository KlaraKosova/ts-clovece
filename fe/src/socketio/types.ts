import { type Socket } from 'socket.io-client'
import { type UserInfo } from '../types/UserInfo'
import { type GamePreviewDTO } from '../types/dtos/GamePreviewDTO'
import { type GameProgressDTO } from '../types/dtos/GameProgressDTO'
import { type GameProgressUpdateDTO } from '../types/dtos/GameProgressUpdateDTO'

// redirect_X events are handled in App
// other in dedicated functions
export interface ServerToClientEvents {
    REDIRECT_GAME_SELECT: () => void
    REDIRECT_GAME_WAIT: (data: UserInfo & { players: number }) => void
    GAME_WAIT_UPDATE: (data: { players: number }) => void
    GAME_SELECT_RESPONSE: (data: { games: GamePreviewDTO[] }) => void
    REDIRECT_GAME_PROGRESS: () => void
    GAME_PROGRESS_RESPONSE: (data: GameProgressDTO) => void
    GAME_PROGRESS_UPDATE: (data: { progress: GameProgressDTO, updates: GameProgressUpdateDTO[] }) => void
    GAME_WINNER: (data: { winnerId: string }) => void
}

export interface ClientToServerEvents {
    INIT: (data: UserInfo | null) => void
    GAME_SELECT_REQUEST: () => void
    NEW_GAME: (data: { name: string }) => void
    JOIN_GAME: (data: { gameId: string }) => void
    GAME_PROGRESS_REQUEST: () => void
    CLIENT_GAME_PROGRESS_UPDATE: (data: GameProgressUpdateDTO[]) => void
    NEXT_PLAYER_MOVE: () => void
}

export type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents>
