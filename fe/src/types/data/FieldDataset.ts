import { PlayerColors } from "../common/PlayerColors";

export type FieldDataset = {
    index: number,
    isStart: boolean,
    isHome: boolean,
    color: PlayerColors | null
}
