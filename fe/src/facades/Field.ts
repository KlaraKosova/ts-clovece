import { FieldDataset } from "../types/data/FieldDataset";
import { HasDataset } from "./HasDataset";
import cloneDeep from "lodash/cloneDeep"

export class Field implements HasDataset<FieldDataset> {
    private dataset: FieldDataset

    public getDataset() {
        return cloneDeep(this.dataset)
    }

    public setDataset(dataset: FieldDataset) {
        this.dataset = cloneDeep(dataset)
    }
}