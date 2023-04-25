import { FieldDataset } from "./FieldDataset";

export type GameProgressUpdate = {
    type: 'MOVE' | 'KICK',
    prevField: FieldDataset,
    nextField: FieldDataset
}