import { type FigureDTO } from '@/types/dtos/FigureDTO'
import cloneDeep from 'lodash/cloneDeep'
import { type FieldDTO } from '@/types/dtos/FieldDTO'
import { objectCompare } from '@/utils/common'
import { type HasDTO } from '../../types/dtos/HasDTO'

export class Figure implements HasDTO<FigureDTO> {
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
        return this.field
    }

    public setField(field: FieldDTO): void {
        this.field = field
    }

    public setPath(path: FieldDTO[]): void {
        this.path = cloneDeep(path)
    }

    public computeNextField(diceThrow: number): FieldDTO | null {
        if (this.field.isStart) {
            return diceThrow === 6 ? this.path[0] : null
        }
        const currentIndex = this.path.findIndex(f => objectCompare(f, this.field))
        return this.path[currentIndex + diceThrow] || null
    }
}
