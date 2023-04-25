import { PlayerColors } from "../common/PlayerColors"
import { FieldDataset } from "./FieldDataset"

export type PlayerStatus = {
    color: PlayerColors
    userId: string
    figures: FieldDataset[]
}
