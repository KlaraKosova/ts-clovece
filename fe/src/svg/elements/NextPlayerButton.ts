import {GameElement} from "../GameElement";
import Consts from "../../helpers/svgBoardConstants";
import {Svg} from "@svgdotjs/svg.js";

export class NextPlayerButton extends GameElement {
    constructor(draw: Svg) {
        super(draw);
        this.svg.setCSS({
            cursor: 'pointer'
        })
        this.svg.setDataset({nextPlayerButton: true})
    }
    public render() {
        this.svg.createChild({
            type: 'rect',
            size: {
                x: Consts.BOARD.NO_MOVES_MODAL.WIDTH - 10,
                y: 20
            },
            radius: 10,center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 + 15 - Consts.BOARD.NO_MOVES_MODAL.INITIAL_OFFSET },
            color: Consts.BOARD.FRAMES.GREEN.COLOR
        })

        this.svg.createChild({
            type: 'text',
            text: 'Dalsi hrac \u279C',
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 + 15 - Consts.BOARD.NO_MOVES_MODAL.INITIAL_OFFSET },
            font: {
                size: '1rem',
                fill: "#fff"
            },
        })
    }
    public async moveDown () {
        await this.svg.move({
            duration: 500,
            offset: {
                x: 0,
                y: Consts.BOARD.NO_MOVES_MODAL.INITIAL_OFFSET
            }
        })
    }
}
