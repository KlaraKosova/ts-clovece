import { PlayerColors } from "../PlayerColors"
import { PlayerStatusDTO } from "./PlayerStatusDTO"

export type GameProgressDTO = {
    name: string
    players: number
    playerStatuses: Record<PlayerColors, PlayerStatusDTO>
    lastDiceSequence: number[]
    currentPlayerId: string
}