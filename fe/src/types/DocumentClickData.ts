import { FieldDTO } from "./dtos/FieldDTO"
import { FigureDTO } from "./dtos/FigureDTO"

export type DocumentClickData = {
    field: FieldDTO | null
    figure: FigureDTO | null
    dice: boolean
    playButton: boolean
    nextPlayerButton: boolean
}