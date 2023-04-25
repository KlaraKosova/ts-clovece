import { PlayerColors } from "../common/PlayerColors"
import { PlayerStatus } from "./PlayerStatus"

export type GameProgressDataset = {
    name: string
    players: number
    playerStatuses: Record<PlayerColors, PlayerStatus>
    lastDiceSequence: number[]
    currentPlayerId: string
}