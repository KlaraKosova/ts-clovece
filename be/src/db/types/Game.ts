import {WithId, Document} from "mongodb";
type FieldNumber = number | 'H0' | 'H1' |'H2' |'H3' | 'S0' | 'S1' | 'S2' | 'S3'

export type Player = {
    token: string
    color: string
    figurePositions: FieldNumber[]
}

export interface GameDocument extends WithId<Document> {
    players: Player[]
    lastDiceSequence: number[]
    currentRoundPlayerIndex: 0 | 1 | 2 | 3
}
