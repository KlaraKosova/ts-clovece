import { HasDataset } from "./HasDataset";
import { FieldDataset, FigureDataset, GameProgressDataset, PlayersOrder } from "../types";
import { defaultGameProgressDataset } from "../helpers/constants";
import { objectCompare } from "../helpers/common";

export class GameProgress implements HasDataset<GameProgressDataset> {
    private dataset: GameProgressDataset

    constructor() {
        this.dataset = defaultGameProgressDataset
    }

    public getDataset(): GameProgressDataset {
        return this.dataset
    }

    public setDataset(dataset: GameProgressDataset): void {
        this.dataset = dataset
    }

    public getCurrentPlayerId(): string {
        return this.dataset.currentPlayerId
    }

    public getLastDiceSequence(): number[] {
        return this.dataset.lastDiceSequence
    }

    public getFigureByField(field: FieldDataset): FigureDataset | null {
        console.log('currentDataset', this.dataset);

        for (let i = 0; i < 4; i++) {
            const color = PlayersOrder[i]
            for (let i = 0; i < 4; i++) {
                const figureField = this.dataset.playerStatuses[color].figures[i]
                if (objectCompare(figureField, field)) {

                    return { color, index: i }
                }
            }
        };
        return null
    }
}