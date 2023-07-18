import { type FieldDTO } from '@/types/dtos/FieldDTO'
import cloneDeep from 'lodash/cloneDeep'
import { type HasDTO } from '../../types/dtos/HasDTO'

export class Field implements HasDTO<FieldDTO> {
    private dto: FieldDTO

    public setDTO(dto: FieldDTO): void {
        this.dto = cloneDeep(dto)
    }

    public getDTO(): FieldDTO {
        return cloneDeep(this.dto)
    }
}
