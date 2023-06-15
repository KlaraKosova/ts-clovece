import {FieldDTO} from "@/types/dtos/FieldDTO";
import cloneDeep from "lodash/cloneDeep";
import { HasDTO } from "../HasDTO";

export class Field implements HasDTO<FieldDTO> {
    private dto: FieldDTO

    public setDTO(dto: FieldDTO) {
        this.dto = cloneDeep(dto)
    }

    public getDTO(): FieldDTO {
        return cloneDeep(this.dto)
    }
}