import { cloneDeep } from "lodash";
import { Figure } from "../facades/Figure";
import { HasDataset } from "../facades/HasDataset";
import { PlayerColors, PlayersOrder } from "../types/common/PlayerColors";
import { GameProgressDataset } from "../types/data/GameProgressDataset";
import { defaultGameProgressDataset } from "../utils/constants";

export class LogicLayer implements HasDataset<GameProgressDataset> {
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

    public getCurrentPlayerId() {
        return this.dataset.currentPlayerId
    }

    public getLastDiceSequence() {
        return [...this.dataset.lastDiceSequence]
    }
}