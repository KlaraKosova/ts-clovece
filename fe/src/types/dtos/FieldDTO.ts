import { PlayerColors } from "../PlayerColors";

export type FieldDTO = {
    index: number,
    isStart: boolean,
    isHome: boolean,
    color: PlayerColors | null
}
