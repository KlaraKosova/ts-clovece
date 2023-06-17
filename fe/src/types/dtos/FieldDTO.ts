import { type PlayerColors } from '../PlayerColors'

export interface FieldDTO {
    index: number
    isStart: boolean
    isHome: boolean
    color: PlayerColors | null
}
