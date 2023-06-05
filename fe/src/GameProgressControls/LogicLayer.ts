import {HasDataset} from "@/facades/HasDataset";
import {GameProgressDataset} from "@/types/data/GameProgressDataset";
import cloneDeep from "lodash/cloneDeep";

export class LogicLayer implements HasDataset<GameProgressDataset>{
    private dataset: GameProgressDataset

    public setDataset(dataset: GameProgressDataset) {
        this.dataset = cloneDeep(dataset)
    }

    public getDataset(): GameProgressDataset {
        return
    }

    public getCurrentPlayerId() {
        return this.dataset.currentPlayerId
    }

    public getDiceSequence() {
        return [...this.dataset.lastDiceSequence]
    }

    public getDiceResult() {
        return this.dataset.lastDiceSequence[this.dataset.lastDiceSequence.length - 1]
    }
}