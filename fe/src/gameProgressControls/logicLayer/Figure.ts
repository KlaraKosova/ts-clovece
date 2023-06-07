import {HasDataset} from "@/facades/HasDataset";
import {FigureDataset} from "@/types/data/FigureDataset";
import cloneDeep from "lodash/cloneDeep";
import {FieldDataset} from "@/types/data/FieldDataset";
import {Field} from "@/gameProgressControls/logicLayer/Field";
import {objectCompare} from "@/utils/common";

export class Figure implements HasDataset<FigureDataset> {
    private dataset: FigureDataset
    private path: FieldDataset[] = []
    private field: Field

    public getDataset(): FigureDataset {
        return cloneDeep(this.dataset)
    }

    public setDataset(dataset: FigureDataset) {
        this.dataset = cloneDeep(dataset)
    }

    public getField() {
        return this.field
    }

    public setField(field: Field) {
        this.field = field
    }

    public setPath(path: FieldDataset[]) {
        this.path = cloneDeep(path)
    }

    public computeNextField(diceThrow: number): FieldDataset | null {
        if (this.field.getDataset().isStart) {
            return diceThrow === 6 ? this.path[0] : null
        }
        const currentIndex = this.path.findIndex(f => objectCompare(f, this.field.getDataset()));
        return this.path[currentIndex + diceThrow] || null
    }
}