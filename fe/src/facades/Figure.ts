import cloneDeep from "lodash/cloneDeep";
import { HasDataset } from "./HasDataset";
import { Field } from "./Field";
import { FigureDataset } from "../types/data/FigureDataset";
import { FieldDataset } from "../types/data/FieldDataset";

export class Figure implements HasDataset<FigureDataset> {
    private dataset: FigureDataset
    private path = null as null | Field[]
    private field: Field

    public getDataset(): FigureDataset {
        return cloneDeep(this.dataset)
    }

    public setDataset(dataset: FigureDataset): void {
        this.dataset = cloneDeep(dataset)
    }

    public setPath(path: Field[]) {
        this.path = [...path]
    }

    public setField(field: Field) {
        this.field = field
    }

    public getField() {
        return this.field
    }

    public computeNextField(dice: number): FieldDataset | null {
        if (this.path === null) {
            throw new Error("Path not set")
        }
        if (this.field.getDataset().isStart) {
            return dice === 6 ? this.path[0].getDataset() : null
        }
        const currentIndex = this.path.indexOf(this.field);
        return this.path[currentIndex + dice]?.getDataset() || null
    }
}