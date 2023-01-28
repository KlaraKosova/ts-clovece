import { GameElement } from './GameElement'
import { Runner, Svg } from '@svgdotjs/svg.js'
import { FieldInfo, Coordinates } from '../types'
import Consts from "../helpers/svgBoardConstants";
import { centers, homeCenters, startCenters } from '../helpers/fieldCenters'
import { HasHighlightAnimation } from './HasHighlightAnimation';

export class Field extends GameElement /* implements HasHighlightAnimation */ {
    private color: { front: string, back: string }
    private center: Coordinates
    private text = ''
    private animationRunner: Runner
    private fieldInfo: FieldInfo

    constructor(draw: Svg, info: FieldInfo) {
        super(draw)

        this.fieldInfo = info
        this.animationRunner = new Runner()

        if (info.isHome) {
            this.center = homeCenters[info.playerColor][info.index]
        } else if (info.isStart) {
            this.center = startCenters[info.playerColor][info.index]
        } else {
            this.center = centers[info.index]
            if (info.index % 10 === 0) {
                this.text = 'A'
            }
        }

        if (info.playerColor === null) {
            this.color = { front: '#ffffff', back: "#000000" }
        } else {
            this.color = {
                front: Consts.COLORS[info.playerColor].front,
                back: Consts.COLORS[info.playerColor].back,
            }
        }
    }

    render(): void {
        this.svg.createChild({ type: 'circle', diameter: Consts.BOARD.FIELDS.OUTER_SIZE, color: this.color.back, center: this.center })
        this.svg.createChild({ type: 'circle', diameter: Consts.BOARD.FIELDS.INNER_SIZE, color: this.color.front, center: this.center })
        this.svg.setDataset(this.fieldInfo)

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
}
