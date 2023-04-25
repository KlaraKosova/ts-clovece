import { HasDataset } from "./HasDataset"
import { defaultGameProgressDataset } from "../utils/constants"
import { objectCompare } from "../utils/common"
import cloneDeep from "lodash/cloneDeep"
import { Figure } from "./Figure"
import { GameProgressDataset } from "../types/data/GameProgressDataset"
import { PlayerColors, PlayersOrder } from "../types/common/PlayerColors"
import { FieldDataset } from "../types/data/FieldDataset"
import { FigureDataset } from "../types/data/FigureDataset"

export class GameProgress implements HasDataset<GameProgressDataset> {
    private dataset: GameProgressDataset
    private figures: Record<PlayerColors, Figure[]>

    constructor() {
        this.setDataset(defaultGameProgressDataset)
    }

    public getDataset(): GameProgressDataset {
        return cloneDeep(this.dataset)
    }

    public setDataset(dataset: GameProgressDataset): void {
        this.dataset = cloneDeep(dataset)

        this.figures = {
            [PlayerColors.RED]: [],
            [PlayerColors.GREEN]: [],
            [PlayerColors.BLUE]: [],
            [PlayerColors.YELLOW]: []
        }
        for (const color of PlayersOrder) {
            for(let i = 0; i < 4; i++) {
                const figure = new Figure()
                figure.setDataset(dataset.playerStatuses[color].figures[i])

                this.figures[color].push(figure)
            }
        }
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