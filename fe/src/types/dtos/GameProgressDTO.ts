import { type PlayerColors } from '../PlayerColors'
import { type PlayerStatusDTO } from './PlayerStatusDTO'

export interface GameProgressDTO {
    name: string
    players: number
    playerStatuses: Record<PlayerColors, PlayerStatusDTO>
    lastDiceSequence: number[]
    currentPlayerId: string
}
