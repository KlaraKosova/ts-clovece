import { Svg } from "@svgdotjs/svg.js";
import { FieldInfo, PlayerColor } from "../types";
import { GameElement } from "./GameElement";
import Consts from "../helpers/svgBoardConstants"
import { centers, homeCenters, startCenters } from "../helpers/fieldCenters";

export class Figure extends GameElement {
    public field: FieldInfo;
    private playerColor: PlayerColor
    constructor(draw: Svg, playerColor: PlayerColor, field: FieldInfo) {
        super(draw)
        this.playerColor = playerColor
        this.field = field
    }
    public setField(field: FieldInfo) {
        this.field = field
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
        // this.svg.setId(`player_${this.playerColor}_figure_${this.index}`)
    }
}
