import { type FieldDTO } from './dtos/FieldDTO'
import { type FigureDTO } from './dtos/FigureDTO'

export interface DocumentClickData {
    field: FieldDTO | null
    figure: FigureDTO | null
    dice: boolean
    playButton: boolean
    nextPlayerButton: boolean
}
