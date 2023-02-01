import { GameElement } from './GameElement'
import { Runner, Svg } from '@svgdotjs/svg.js'
import { FieldDataset, Coordinates } from '../types'
import Consts from "../helpers/svgBoardConstants";
import { centers, homeCenters, startCenters } from '../helpers/fieldCenters'
import { HasHighlightAnimation } from './HasHighlightAnimation';

export class Field extends GameElement implements HasHighlightAnimation {
    private color: { front: string, back: string }
    private center: Coordinates
    private text = ''
    private animationRunner: Runner
    private fieldDataset: FieldDataset

    constructor(draw: Svg, dataset: FieldDataset) {
        super(draw)

        this.fieldDataset = dataset
        this.svg.addClass('field')
        this.animationRunner = new Runner()

        if (dataset.isHome) {
            this.center = homeCenters[dataset.color][dataset.index]
        } else if (dataset.isStart) {
            this.center = startCenters[dataset.color][dataset.index]
        } else {
            this.center = centers[dataset.index]
            if (dataset.index % 10 === 0) {
                this.text = 'A'
            }
        }

        if (dataset.color === null) {
            this.color = { front: '#ffffff', back: "#000000" }
        } else {
            this.color = {
                front: Consts.COLORS[dataset.color].front,
                back: Consts.COLORS[dataset.color].back,
            }
        }
    }

    render(): void {
        this.svg.createChild({ type: 'circle', diameter: Consts.BOARD.FIELDS.OUTER_SIZE, color: this.color.back, center: this.center })
        this.svg.createChild({ type: 'circle', diameter: Consts.BOARD.FIELDS.INNER_SIZE, color: this.color.front, center: this.center })
        this.svg.setDataset(this.fieldDataset)


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

    clear() {
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
    // TODO
    /* highlightAnimationStart(): void {
        // TODO
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.animationRunner = this.group.getNthChild(2).animate({
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

    highlightAnimationStop(): void {
        this.animationRunner.loops(2)
        this.animationRunner.unschedule()
        this.svg.setCSS({
            cursor: 'default'
        })
    } */
    public getFieldDataset() {
        return this.fieldDataset
    }

    public getCoordinates(): Coordinates {
        if (this.fieldDataset.isHome) {
            return homeCenters[this.fieldDataset.color][this.fieldDataset.index]
        }
        if (this.fieldDataset.isStart) {
            return startCenters[this.fieldDataset.color][this.fieldDataset.index]
        }
        return centers[this.fieldDataset.index]
    }
}
