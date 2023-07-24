import {WithId} from 'mongodb'
import {GameProgressDTO} from "./dtos/GameProgressDTO";

export interface GameProgressDocument extends WithId<Document>, GameProgressDTO {
}
