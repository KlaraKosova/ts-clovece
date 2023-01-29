import { Runner, Svg } from "@svgdotjs/svg.js";
import { FieldInfo, PlayerColor } from "../types";
import { GameElement } from "./GameElement";
import Consts from "../helpers/svgBoardConstants"
import { centers, homeCenters, startCenters } from "../helpers/fieldCenters";
import { HasHighlightAnimation } from "./HasHighlightAnimation";

export class Figure extends GameElement implements HasHighlightAnimation {
    public field: FieldInfo;
    private playerColor: PlayerColor
    private animationRunners = [] as Runner[]
    constructor(draw: Svg, playerColor: PlayerColor, field: FieldInfo) {
        super(draw)
        this.playerColor = playerColor
        this.field = field
        for (let i = 0; i < 4; i++) {
            this.animationRunners[i] = new Runner()
        }
    }
    public setField(field: FieldInfo) {
        this.field = field
    }

    public getField() {
        return this.field
    }
    public render() {
        this.clear()
        const color = Consts.COLORS[this.playerColor]

        let center
        if (this.field.isHome) {
            center = homeCenters[this.playerColor][this.field.index]
        } else if (this.field.isStart) {
            center = startCenters[this.playerColor][this.field.index]
        } else {
            center = centers[this.field.index]
        }

        this.svg.createChild({
            type: 'circle',
            diameter: 22,
            color: color.front,
            center: { x: center.x + 1, y: center.y + 1 }
        })
        this.svg.createChild({
            type: 'circle',
            diameter: 20,
            color: color.shadow,
            center
        })
        this.svg.createChild({
            type: 'circle',
            diameter: 11,
            color: color.front,
            center: { x: center.x + 1, y: center.y + 1 }
        })
        this.svg.createChild({
            type: 'circle',
            diameter: 11,
            color: color.highlight,
            center
        })

        this.svg.setCSS({
            cursor: 'pointer'
        })
    }

    public highlightAnimationStart(): void {
        const colors = [Consts.COLORS.HIGHLIGHT.highlight, Consts.COLORS.HIGHLIGHT.front, Consts.COLORS.HIGHLIGHT.back, Consts.COLORS.HIGHLIGHT.shadow]
        for (let i = 0; i < 4; i++) {
            this.animationRunners[i] = this.svg.getNthChild(i + 1).animate({
                duration: 500,
                delay: 0,
                when: 'now',
                swing: true,
                times: Infinity,
                wait: 200
            }).attr({ fill: colors[i] })
            this.svg.setCSS({ cursor: 'pointer' })
        }

    }

    public highlightAnimationStop(): void {
        for (let i = 0; i < 4; i++) {
            this.animationRunners[i].loops(2)
            this.animationRunners[i].unschedule()
        }
        this.svg.setCSS({ cursor: 'default' })
    }
}
