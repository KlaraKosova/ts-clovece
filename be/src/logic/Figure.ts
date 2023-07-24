import { type HasDTO } from '../types/dtos/HasDTO'
import { type FigureDTO } from '../types/dtos/FigureDTO'
import { type FieldDTO } from '../types/dtos/FieldDTO'
import { isEqual, cloneDeep } from "lodash"

export class Figure implements HasDTO<FigureDTO> {
    // @ts-ignore
    private dto: FigureDTO
    private path: FieldDTO[] = []
    private field: FieldDTO

    public getDTO(): FigureDTO {
        return cloneDeep(this.dto)
    }

    public setDTO(dto: FigureDTO): void {
        this.dto = cloneDeep(dto)
    }

     public getField(): FieldDTO {
        return cloneDeep(this.field)
    }

    public setField(field: FieldDTO): void {
        this.field = cloneDeep(field)
    }

    public setPath(path: FieldDTO[]): void {
        this.path = cloneDeep(path)
    }

    public computeNextField(diceThrow: number): FieldDTO | null {
        if (this.field.isStart) {
            return diceThrow === 6 ? this.path[0] : null
        }
        const currentIndex = this.path.findIndex(f => isEqual(f, this.field))
        return this.path[currentIndex + diceThrow] || null
    }
}
