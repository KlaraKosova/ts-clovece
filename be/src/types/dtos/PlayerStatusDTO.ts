import { type PlayerColors } from '../PlayerColors'
import { type FieldDTO } from './FieldDTO'

export interface PlayerStatusDTO {
    color: PlayerColors
    userId: string
    figures: FieldDTO[]
}
