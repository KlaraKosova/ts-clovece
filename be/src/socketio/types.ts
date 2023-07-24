import type { Server, Socket } from 'socket.io'
import {GameProgressUpdateDTO} from "../types/dtos/GameProgressUpdateDTO";
import {GameProgressDTO} from "../types/dtos/GameProgressDTO";
import {GamePreviewDTO} from "../types/dtos/GamePreviewDTO";
import {UserInfo} from "../types/UserInfo";

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
    GAME_PROGRESS_REQUEST: (data: { gameId: string }) => void
    CLIENT_GAME_PROGRESS_UPDATE: (data: GameProgressUpdateDTO[]) => void
    NEXT_PLAYER_MOVE: () => void
}

export type SocketIO = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, UserInfo>
export type ServerIO = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, UserInfo>
