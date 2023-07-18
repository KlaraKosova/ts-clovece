import { type GameProgressDTO } from '@/types/dtos/GameProgressDTO'
import cloneDeep from 'lodash/cloneDeep'
import { type FieldDTO } from '@/types/dtos/FieldDTO'
import { type FigureDTO } from '@/types/dtos/FigureDTO'
import { type PlayerColors, PlayersOrder } from '@/types/PlayerColors'
import { Field } from './logic/Field'
import { Figure } from './logic/Figure'
import { type UserInfo } from '@/types/UserInfo'
import { objectCompare } from '@/utils/common'
import { type GameProgressUpdateDTO } from '@/types/dtos/GameProgressUpdateDTO'
import { type HasDTO } from '../types/dtos/HasDTO'
import { defaultGameProgressDTO } from '@/utils/constants'

export class LogicControl implements HasDTO<GameProgressDTO> {
    private dto: GameProgressDTO
    private readonly user: UserInfo
    private readonly mainFields: Field[]
    private startFields: Record<PlayerColors, Field[]>
    private homeFields: Record<PlayerColors, Field[]>
    private figures: Record<PlayerColors, Figure[]>

    public constructor(user: UserInfo) {
        this.user = user

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

        this.setDTO(defaultGameProgressDTO)
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

    public getCurrentPlayerId(): string {
        return this.dto.currentPlayerId
    }

    public getPlayerColorById(id: string): PlayerColors {
        for (const color of PlayersOrder) {
            if (this.dto.playerStatuses[color].userId === id) {
                return color
            }
        }

        throw new Error("Player ID doesn't exist")
    }

    public getDiceSequence(): number[] {
        return [...this.dto.lastDiceSequence]
    }

    public getDiceResult(): number {
        return this.dto.lastDiceSequence[this.dto.lastDiceSequence.length - 1]
    }

    public getAvailable(): ({ fields: FieldDTO[], figures: FigureDTO[], homeMovesOnly: boolean }) {
        const result = {
            fields: [] as FieldDTO[],
            figures: [] as FigureDTO[],
            homeMovesOnly: true
        }

        const diceResult = this.getDiceResult()
        const playerFigures = this.figures[this.user.color]

        for (let i = 0; i < 4; i++) {
            const currentFigure = playerFigures[i]
            const nextField: FieldDTO | null = currentFigure.computeNextField(diceResult)

            const alreadyIncluded = result.fields.find(f => objectCompare(f, nextField))
            if (nextField && !alreadyIncluded) {
                const figure = this.getFigureByFieldDTO(nextField)
                let fieldPushed = false

                // figures at home should not be eliminated not even by figures of the same color
                // so do nothing
                /* if (nextField.isHome && figure) {

                } */

                if (nextField.isHome && !figure) {
                    result.fields.push(nextField)
                    fieldPushed = true
                }

                if (!nextField.isHome) {
                    result.fields.push(nextField)
                    fieldPushed = true

                    if (figure) {
                        result.figures.push(figure.getDTO())
                    }
                }

                if (fieldPushed && (!nextField.isHome || !currentFigure.getField().isHome)) {
                    result.homeMovesOnly = false
                }
            }
        }

        return result
    }

    public getUpdates(playerColor: PlayerColors, data: { field: FieldDTO | null, figure: FigureDTO | null }): GameProgressUpdateDTO[] {
        const result = [] as GameProgressUpdateDTO[]

        let destFieldDTO: FieldDTO | null = null
        let srcFigure = null as Figure | null
        let destFigure = null as Figure | null

        if (data.field) {
            destFieldDTO = data.field
            srcFigure = this.getFigureByNextFieldDTO(data.field, playerColor)
            destFigure = this.getFigureByFieldDTO(data.field)
        } else if (data.figure) {
            destFigure = this.getFigureByFigureDTO(data.figure)
            destFieldDTO = destFigure.getField()
            srcFigure = this.getFigureByNextFieldDTO(destFieldDTO, playerColor)
        }

        if (!srcFigure || !destFieldDTO) {
            throw new Error(`Invalid move, data: ${JSON.stringify(data)}`)
        }

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

            srcFigure.setField(destFieldDTO)
            destFigure.setField(startField.getDTO())
        } else {
            result.push({
                type: 'MOVE',
                prevField: srcFigure.getField(),
                nextField: destFieldDTO,
                figure: srcFigure.getDTO()
            })

            srcFigure.setField(destFieldDTO)
        }

        return result
    }

    public getWinnerColor(): PlayerColors | null {
        for (const playerColor of PlayersOrder) {
            const allHome = this.figures[playerColor].every((f) => f.getField().isHome)
            if (allHome) {
                return playerColor
            }
        }

        return null
    }

    public getCurrentColor(): PlayerColors {
        for (const playerColor of PlayersOrder) {
            if (this.dto.playerStatuses[playerColor].userId === this.dto.currentPlayerId) {
                return playerColor
            }
        }

        throw new Error(`Current player with ID ${this.dto.currentPlayerId} does not exist`)
    }

    private getFigureByFieldDTO(field: FieldDTO): Figure | null {
        for (const playerColor of PlayersOrder) {
            for (let i = 0; i < 4; i++) {
                const figure = this.figures[playerColor][i]

                if (objectCompare(figure.getField(), field)) {
                    return figure
                }
            }
        }

        return null
    }

    private getFigureByNextFieldDTO(field: FieldDTO, color?: PlayerColors): Figure | null {
        const diceResult = this.getDiceResult()

        if (color !== undefined) {
            for (let i = 0; i < 4; i++) {
                const figure = this.figures[color][i]

                if (objectCompare(figure.computeNextField(diceResult), field)) {
                    return figure
                }
            }
        } else {
            for (const playerColor of PlayersOrder) {
                for (let i = 0; i < 4; i++) {
                    const figure = this.figures[playerColor][i]

                    if (objectCompare(figure.computeNextField(diceResult), field)) {
                        return figure
                    }
                }
            }
        }

        return null
    }

    private getFigureByFigureDTO(figure: FigureDTO): Figure {
        return this.figures[figure.color][figure.index]
    }

    private getFreeStartField(color: PlayerColors): Field {
    // TODO refactor this
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

                if (objectCompare(figureFieldDTO, startFieldDTO)) {
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
