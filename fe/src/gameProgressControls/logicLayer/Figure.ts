import {FigureDTO} from "@/types/dtos/FigureDTO";
import cloneDeep from "lodash/cloneDeep";
import {FieldDTO} from "@/types/dtos/FieldDTO";
import {Field} from "@/gameProgressControls/logicLayer/Field";
import {objectCompare} from "@/utils/common";
import { HasDTO } from "../HasDTO";

export class Figure implements HasDTO<FigureDTO> {
    private dto: FigureDTO
    private path: FieldDTO[] = []
    private field: FieldDTO

    public getDTO(): FigureDTO {
        return cloneDeep(this.dto)
    }

    public setDTO(dto: FigureDTO) {
        this.dto = cloneDeep(dto)
    }

    public getField() {
        return this.field
    }

    public setField(field: FieldDTO) {
        this.field = field
    }

    public setPath(path: FieldDTO[]) {
        this.path = cloneDeep(path)
    }

    public computeNextField(diceThrow: number): FieldDTO | null {
        if (this.field.isStart) {
            return diceThrow === 6 ? this.path[0] : null
        }
        const currentIndex = this.path.findIndex(f => objectCompare(f, this.field));
        return this.path[currentIndex + diceThrow] || null
    }
}