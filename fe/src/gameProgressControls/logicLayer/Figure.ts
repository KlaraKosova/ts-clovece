import {FigureDataset} from "@/types/data/FigureDataset";
import cloneDeep from "lodash/cloneDeep";
import {FieldDataset} from "@/types/data/FieldDataset";
import {Field} from "@/gameProgressControls/logicLayer/Field";
import {objectCompare} from "@/utils/common";
import { HasDataset } from "../HasDataset";

export class Figure implements HasDataset<FigureDataset> {
    private dataset: FigureDataset
    private path: FieldDataset[] = []
    private field: FieldDataset

    public getDataset(): FigureDataset {
        return cloneDeep(this.dataset)
    }

    public setDataset(dataset: FigureDataset) {
        this.dataset = cloneDeep(dataset)
    }

    public getField() {
        return this.field
    }

    public setField(field: FieldDataset) {
        this.field = field
    }

    public setPath(path: FieldDataset[]) {
        this.path = cloneDeep(path)
    }

    public computeNextField(diceThrow: number): FieldDataset | null {
        if (this.field.isStart) {
            return diceThrow === 6 ? this.path[0] : null
        }
        const currentIndex = this.path.findIndex(f => objectCompare(f, this.field));
        return this.path[currentIndex + diceThrow] || null
    }
}