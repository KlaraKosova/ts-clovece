import { PlayerColors } from "../PlayerColors"
import { FieldDTO } from "./FieldDTO"

export type PlayerStatusDTO = {
    color: PlayerColors
    userId: string
    figures: FieldDTO[]
}
