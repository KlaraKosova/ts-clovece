import { type FieldDTO } from './FieldDTO'
import { type FigureDTO } from './FigureDTO'

export interface GameProgressUpdateDTO {
    type: 'MOVE' | 'KICK'
    prevField: FieldDTO
    nextField: FieldDTO
    figure: FigureDTO
}
