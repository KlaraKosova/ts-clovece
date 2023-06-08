import {FieldDataset} from "@/types/data/FieldDataset";
import cloneDeep from "lodash/cloneDeep";
import { HasDataset } from "../HasDataset";

export class Field implements HasDataset<FieldDataset> {
    private dataset: FieldDataset

    public setDataset(dataset: FieldDataset) {
        this.dataset = cloneDeep(dataset)
    }

    public getDataset(): FieldDataset {
        return cloneDeep(this.dataset)
    }
}