import { SvgComponent } from './base/SvgComponent'
import { Runner, type Svg } from '@svgdotjs/svg.js'
import Consts from '../utils/svgBoardConstants'
import { centers, homeCenters, startCenters } from '../utils/fieldCenters'
import { type HasHighlightAnimation } from './base/HasHighlightAnimation'
import { type Coordinates } from '../types/Coordinates'
import { type FieldDTO } from '../types/dtos/FieldDTO'
import { cloneDeep } from 'lodash'
import { type HasDTO } from '../gameProgressControls/HasDTO'

export class Field extends SvgComponent implements HasHighlightAnimation, HasDTO<FieldDTO> {
    private readonly color: { front: string, back: string }
    private readonly center: Coordinates
    private readonly text: string
    private animationRunner: Runner
    private dto: FieldDTO

    constructor(draw: Svg, dto: FieldDTO) {
        super(draw)

        this.dto = dto
        this.svg.addClass('field')
        this.animationRunner = new Runner()

        if (dto.isHome) {
            this.center = homeCenters[dto.color][dto.index]
        } else if (dto.isStart) {
            this.center = startCenters[dto.color][dto.index]
        } else {
            this.center = centers[dto.index]
            if (dto.index % 10 === 0) {
                this.text = 'A'
            }
        }

        if (dto.color === null) {
            this.color = { front: '#ffffff', back: '#000000' }
        } else {
            this.color = {
                front: Consts.COLORS[dto.color].FIELD_FRONT,
                back: Consts.COLORS[dto.color].FIELD_BACK
            }
        }
    }

    render(): void {
        this.svg.createChild({ type: 'circle', diameter: Consts.BOARD.FIELDS.OUTER_SIZE, color: this.color.back, center: this.center })
        this.svg.createChild({ type: 'circle', diameter: Consts.BOARD.FIELDS.INNER_SIZE, color: this.color.front, center: this.center })
        this.svg.setDataset(this.dto)

        if (this.text) {
            this.svg.createChild({
                type: 'text',
                text: this.text,
                center: this.center,
                font: {
                    weight: 'bold'
                }
            })
        }
    }

    clear(): void {
        this.svg.removeChildren()
    }

    public highlightAnimationStart(): void {
        this.animationRunner = this.svg.getNthChild(2).animate({
            duration: 500,
            delay: 0,
            when: 'now',
            swing: true,
            times: Infinity,
            wait: 200
        }).attr({ fill: '#fc9c2d' })

        this.svg.setCSS({
            cursor: 'pointer'
        })
    }

    public highlightAnimationStop(): void {
        this.animationRunner.loops(2)
        this.animationRunner.unschedule()
        this.svg.setCSS({
            cursor: 'default'
        })
    }

    public getDTO(): FieldDTO {
        return cloneDeep(this.dto)
    }

    public setDTO(dto: FieldDTO): void {
        this.dto = cloneDeep(dto)
    }

    public getCoordinates(): Coordinates {
        if (this.dto.isHome) {
            return homeCenters[this.dto.color][this.dto.index]
        }
        if (this.dto.isStart) {
            return startCenters[this.dto.color][this.dto.index]
        }
        return centers[this.dto.index]
    }
}
