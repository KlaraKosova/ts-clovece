import { type HasDTO } from '../types/dtos/HasDTO'
import { type GameProgressDTO } from '../types/dtos/GameProgressDTO'
import { PlayerColors, PlayersOrder} from '../types/PlayerColors'
import { Figure} from './Figure'
import { Field } from './Field'
import { type FieldDTO } from '../types/dtos/FieldDTO'
import { type FigureDTO } from '../types/dtos/FigureDTO'
import { type GameProgressUpdateDTO } from '../types/dtos/GameProgressUpdateDTO'
import { isEqual, cloneDeep } from 'lodash'

export class Game implements HasDTO<GameProgressDTO>{
    // @ts-ignore
    private dto: GameProgressDTO
    private readonly figures: Record<PlayerColors, Figure[]>
    private readonly mainFields: Field[]
    private readonly startFields: Record<PlayerColors, Field[]>
    private readonly homeFields: Record<PlayerColors, Field[]>

    public constructor() {
        this.startFields = {} as Record<PlayerColors, Field[]>
        this.homeFields = {} as Record<PlayerColors, Field[]>
        this.figures = {} as Record<PlayerColors, Figure[]>
        this.mainFields = [] as Field[]

        for (let i = 0; i < 40; i++) {
            this.mainFields[i] = new Field()
            this.mainFields[i].setDTO({
                index: i,
                color:
                    i % 10 === 0 ? (`${Math.floor(i / 10)}` as PlayerColors) : null,
                isHome: false,
                isStart: false
            })
        }

        PlayersOrder.forEach((playerColor, index) => {
            const path = [] as FieldDTO[]
            const pathStart = index * 10
            for (let i = 0; i < 40; i++) {
                const field = this.mainFields[(pathStart + i) % 40]
                path.push(field.getDTO())
            }

            this.startFields[playerColor] = []
            this.homeFields[playerColor] = []
            this.figures[playerColor] = []

            for (let i = 0; i < 4; i++) {
                this.homeFields[playerColor][i] = new Field()
                this.homeFields[playerColor][i].setDTO({
                    index: i,
                    color: playerColor,
                    isHome: true,
                    isStart: false
                })

                this.startFields[playerColor][i] = new Field()
                this.startFields[playerColor][i].setDTO({
                    index: i,
                    color: playerColor,
                    isHome: false,
                    isStart: true
                })

                path.push({
                    index: i,
                    color: playerColor,
                    isHome: true,
                    isStart: false
                })
            }

            for (let i = 0; i < 4; i++) {
                this.figures[playerColor][i] = new Figure()
                this.figures[playerColor][i].setDTO({ color: playerColor, index: i })
                this.figures[playerColor][i].setField(this.startFields[playerColor][i].getDTO())
                this.figures[playerColor][i].setPath(path)
            }
        })
    }

    public setDTO(dto: GameProgressDTO): void {
        this.dto = cloneDeep(dto)

        PlayersOrder.forEach((playerColor, index) => {
            for (let i = 0; i < 4; i++) {
                this.figures[playerColor][i].setField(this.dto.playerStatuses[playerColor].figures[i])
            }
        })
    }

    public getDTO(): GameProgressDTO {
        return cloneDeep(this.dto)
    }

    public validateUpdates(receivedUpdates: GameProgressUpdateDTO[]): boolean {
        const possibleUpdates = this.getPossibleUpdates()

        return possibleUpdates.some(updates => {
            if (updates.length !== receivedUpdates.length) {
                return false
            }

            return updates.every((update, index) => isEqual(updates[index], receivedUpdates[index]))
        })
    }

    public generateDiceSequence(): number[] {
        const result = [] as number[]
        for (let i = 0; i < 50; i++) {
            let next = Math.round(Math.random() * 5) + 1

            if (i === 0) {
                while (next === result[i - 1]) {
                    next = Math.round(Math.random() * 5) + 1
                }
            }
            result.push(next)
        }

        return result
    }

    private getPossibleUpdates(): GameProgressUpdateDTO[][] {
        const result = [] as GameProgressUpdateDTO[][]
        this.figures[this.getCurrentColor()].forEach(figure => {
            const updates = this.getFigureUpdates(figure.getDTO())

            result.push(updates)
        })

        return result
    }

    private getCurrentColor(): PlayerColors {
        for (const playerColor of PlayersOrder) {
            if (this.dto.playerStatuses[playerColor].userId === this.dto.currentPlayerId) {
                return playerColor
            }
        }

        throw new Error(`Current player with ID ${this.dto.currentPlayerId} does not exist`)
    }

    private getDiceResult(): number {
        return this.dto.lastDiceSequence[this.dto.lastDiceSequence.length - 1]
    }

    private getFigureUpdates(figure: FigureDTO): GameProgressUpdateDTO[] {
        const result = [] as GameProgressUpdateDTO[]

        const srcFigure = this.getFigureByFigureDTO(figure)
        const destFieldDTO = srcFigure.computeNextField(this.getDiceResult())
        if (!destFieldDTO) {
            return []
        }

        const destFigure = this.getFigureByFieldDTO(destFieldDTO)

        if (destFigure) {
            const startField = this.getFreeStartField(destFigure.getDTO().color)
            result.push({
                type: 'KICK',
                prevField: srcFigure.getField(),
                nextField: destFieldDTO,
                figure: srcFigure.getDTO()
            })

            result.push({
                type: 'MOVE',
                prevField: destFigure.getField(),
                nextField: startField.getDTO(),
                figure: destFigure.getDTO()
            })
        } else {
            result.push({
                type: 'MOVE',
                prevField: srcFigure.getField(),
                nextField: destFieldDTO,
                figure: srcFigure.getDTO()
            })
        }

        return result
    }

    private getFigureByFieldDTO(field: FieldDTO): Figure | null {
        for (const playerColor of PlayersOrder) {
            for (let i = 0; i < 4; i++) {
                const figure = this.figures[playerColor][i]

                if (isEqual(figure.getField(), field)) {
                    return figure
                }
            }
        }

        return null
    }

    private getFigureByFigureDTO(figure: FigureDTO): Figure {
        return this.figures[figure.color][figure.index]
    }

    private getFreeStartField(color: PlayerColors): Field {
        const startFields = [...this.startFields[color]] as Array<Field | null>

        for (let i = 0; i < 4; i++) {
            const figure = this.figures[color][i]

            for (let j = 0; j < 4; j++) {
                if (!startFields[j]) {
                    continue
                }
                const figureFieldDTO = figure.getField()

                // skipped by continue statement
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const startFieldDTO = startFields[j]!.getDTO()

                if (isEqual(figureFieldDTO, startFieldDTO)) {
                    startFields[j] = null
                }
            }
        }

        // at least one field is always not null
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        return startFields[0] || startFields[1] || startFields[2] || startFields[3]
    }
}