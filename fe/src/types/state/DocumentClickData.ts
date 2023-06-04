import { FieldDataset } from "../data/FieldDataset"
import { FigureDataset } from "../data/FigureDataset"

export type DocumentClickData = {
    field: FieldDataset | null
    figure: FigureDataset | null
    dice: boolean
    playButton: boolean
    nextPlayerButton: boolean
}