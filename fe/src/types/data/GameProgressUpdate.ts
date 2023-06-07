import { FieldDataset } from "./FieldDataset";
import { FigureDataset } from "./FigureDataset";

export type GameProgressUpdate = {
    type: 'MOVE' | 'KICK',
    prevField: FieldDataset,
    nextField: FieldDataset,
    figure: FigureDataset
}