export type UserInfo = {
    userId: number,
    gameId: number
} | null

export type ViewName = "LOADING" | "GAME_PROGRESS" | "GAME_SELECT" | "GAME_WAITING"