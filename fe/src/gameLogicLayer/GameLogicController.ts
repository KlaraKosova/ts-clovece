import { cloneDeep } from "lodash";
import { HasDataset } from "../facades/HasDataset";
import { GameProgressDataset } from "../types/data/GameProgressDataset";
import { defaultGameProgressDataset } from "../utils/constants";

export class GameLogicController implements HasDataset<GameProgressDataset> {
    private dataset: GameProgressDataset
    constructor () {
        this.setDataset(defaultGameProgressDataset)
    }

    setDataset(dataset: GameProgressDataset): void {
        this.dataset = cloneDeep(dataset)
    }

    getDataset(): GameProgressDataset {
        return cloneDeep(this.dataset)
    }
}