import { Runner, type Svg } from '@svgdotjs/svg.js'
import { GameElement } from './base/GameElement'
import Consts from '../../utils/svgBoardConstants'
import { centers, homeCenters, startCenters } from '../../utils/fieldCenters'
import { type HasHighlightAnimation } from './base/HasHighlightAnimation'
import { type Field } from './Field'
import { coordinatesDiff } from '../../utils/common'
import { type FigureDTO } from '../../types/dtos/FigureDTO'
import { type Coordinates } from '../../types/Coordinates'
import { cloneDeep } from 'lodash'
import { type HasDTO } from '../HasDTO'

export class Figure extends GameElement implements HasHighlightAnimation, HasDTO<FigureDTO> {
    private field: Field
    private dto: FigureDTO
    private animationRunners = [] as Runner[]
    private path = [] as Field[]

    constructor(draw: Svg, info: FigureDTO, field: Field) {
        super(draw)
        this.dto = info
        this.field = field
        this.svg.setDataset(info)
        this.svg.addClass('figure')

        this.animationRunners[0] = new Runner()
        this.animationRunners[1] = new Runner()
    }

    public setPath(path: Field[]): void {
        this.path = path
    }

    public setField(field: Field): void {
        this.field = field
    }

    public getField(): Field {
        return this.field
    }

    public getDTO(): FigureDTO {
        return cloneDeep(this.dto)
    }

    public setDTO(dto: FigureDTO): void {
        this.dto = cloneDeep(dto)
    }

    public render(): void {
        this.clear()
        const color = Consts.COLORS[this.dto.color]
        const dto = this.field.getDTO()

        let center
        if (dto.isHome) {
            center = homeCenters[this.dto.color][dto.index]
        } else if (dto.isStart) {
            center = startCenters[this.dto.color][dto.index]
        } else {
            center = centers[dto.index]
        }

        this.svg.createChild({
            type: 'path',
            path: Consts.FIGURE.RELATIVE_PATH.OUTLINE,
            initialPosition: center,
            color: color.FIGURE_BODY
        })
        this.svg.createChild({
            type: 'path',
            initialPosition: center,
            path: Consts.FIGURE.RELATIVE_PATH.HIGHLIGHT,
            color: color.FIGURE_HIGHLIGHT
        })

        this.svg.setCSS({
            cursor: 'pointer'
        })
    }

    public highlightAnimationStart(): void {
        this.animationRunners[0] = this.svg.getNthChild(1).animate({
            duration: 500,
            delay: 0,
            when: 'now',
            swing: true,
            times: Infinity,
            wait: 200
        }).attr({ fill: Consts.COLORS.HIGHLIGHT.FIGURE_BODY })
        this.animationRunners[1] = this.svg.getNthChild(2).animate({
            duration: 500,
            delay: 0,
            when: 'now',
            swing: true,
            times: Infinity,
            wait: 200
        }).attr({ fill: Consts.COLORS.HIGHLIGHT.FIGURE_BODY })
        this.svg.setCSS({ cursor: 'pointer' })
    }

    public highlightAnimationStop(): void {
        for (let i = 0; i < 2; i++) {
            this.animationRunners[i].loops(2)
            this.animationRunners[i].unschedule()
        }
        this.svg.setCSS({ cursor: 'default' })
    }

    public computeNextField(dice: number): Field | null {
        if (this.path === null) {
            throw new Error('Path not set')
        }
        if (this.field.getDTO().isStart) {
            return dice === 6 ? this.path[0] : null
        }
        const currentIndex = this.path.indexOf(this.field)
        return this.path[currentIndex + dice] || null
    }

    public async animateMoveSequence(finalField: Field): Promise<void> {
        const checkpoints = [] as Field[]
        const finalFieldDTO = finalField.getDTO()

        if (finalFieldDTO.isStart) {
            checkpoints.push(finalField)
        } else {
            const checkpointIndexes = [4, 8, 10, 14, 18, 20, 24, 28, 30, 34, 38, 39]
            const currentFieldIndex = this.path.indexOf(this.field)
            const finalFieldIndex = this.path.indexOf(finalField)
            const filteredCheckpointIndexes = checkpointIndexes
                .filter((index: number): boolean => index < finalFieldIndex && index > currentFieldIndex)

            for (let i = 0; i < filteredCheckpointIndexes.length; i++) {
                const index = filteredCheckpointIndexes[i]
                // console.log(index);
                checkpoints.push(this.path[index])
            }
            checkpoints.push(finalField)
        }

        // console.log(checkpoints)
        for (let i = 0; i < checkpoints.length; i++) {
            await this.moveToField(checkpoints[i])
        }
    }

    public async animateKickSequence(finalField: Field): Promise<void> {
        const index = this.path.indexOf(finalField)
        if (index > 0) {
            await this.animateMoveSequence(this.path[index - 1])
        }

        const sideStepCoordinates = this.getSideStepCenter()
        await this.svg.move({
            duration: 500,
            offset: coordinatesDiff(sideStepCoordinates, this.field.getCoordinates())
        })
        await this.svg.move({
            duration: 500,
            offset: coordinatesDiff(finalField.getCoordinates(), sideStepCoordinates)
        })
        this.field = finalField
    }

    private async moveToField(field: Field): Promise<void> {
        const currentCoordinates = this.field.getCoordinates()
        const nextCoordinates = field.getCoordinates()
        await this.svg.move({
            duration: 500,
            offset: coordinatesDiff(nextCoordinates, currentCoordinates)
        })

        this.field = field
    }

    private getSideStepCenter(): Coordinates {
        const currentCoordinates = this.field.getCoordinates()
        switch (this.field.getDTO().index) {
            case 0:
            case 1:
            case 2:
            case 8:
            case 9:
            case 14:
            case 15:
            case 16:
            case 17:
            // up right
                return {
                    x: currentCoordinates.x + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP
                }
            case 4:
            case 5:
            case 6:
            case 7:
            case 30:
            case 31:
            case 32:
            case 38:
            case 39:
            // up left
                return {
                    x: currentCoordinates.x - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP
                }
            case 10:
            case 11:
            case 12:
            case 18:
            case 19:
            case 24:
            case 25:
            case 26:
            case 27:
            // down right
                return {
                    x: currentCoordinates.x + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP
                }
            case 20:
            case 21:
            case 22:
            case 28:
            case 29:
            case 34:
            case 35:
            case 36:
            case 37:
            // down left
                return {
                    x: currentCoordinates.x - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP
                }
            case 3:
            // up
                return {
                    x: currentCoordinates.x,
                    y: currentCoordinates.y - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP
                }
            case 13:
            // right
                return {
                    x: currentCoordinates.x + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y
                }
            case 23:
            // down
                return {
                    x: currentCoordinates.x,
                    y: currentCoordinates.y + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP
                }
            case 33:
            // left
                return {
                    x: currentCoordinates.x - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y
                }
            default:
                return currentCoordinates
        }
    }
}
