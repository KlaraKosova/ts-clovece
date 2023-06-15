import { FieldDTO } from "./FieldDTO";
import { FigureDTO } from "./FigureDTO";

export type GameProgressUpdateDTO = {
    type: 'MOVE' | 'KICK',
    prevField: FieldDTO,
    nextField: FieldDTO,
    figure: FigureDTO
}