import { type PlayerColors } from '../PlayerColors'

interface HomeFieldDTO {
    isHome: true
    isStart: false
    index: number
    color: PlayerColors
}

interface StartFieldDTO {
    isHome: false
    isStart: true
    index: number
    color: PlayerColors
}

interface MainFieldDTO {
    isHome: false
    isStart: false
    index: number
    color: PlayerColors | null
}

export type FieldDTO = HomeFieldDTO | StartFieldDTO | MainFieldDTO
