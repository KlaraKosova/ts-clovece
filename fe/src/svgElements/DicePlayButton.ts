import {GameElement} from "./GameElement";
import {Svg} from "@svgdotjs/svg.js";
import Consts from "../helpers/svgBoardConstants"

export class DicePlayButton extends GameElement {
    constructor(draw: Svg) {
        super(draw);
        this.svg.setDataset({playButton: true})
    }
    public render() {
        this.svg.createChild({
            type: 'rect',
            color: '#108c0e',
            size: {
                x: 50,
                y: 50
            },
            radius: 15,
            center: { x: 157.5, y: 157.5 }
        })
        this.svg.createChild({
            type: 'text',
            text: '>',
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 },
            font: {
                weight: 'bold',
                size: '2rem'
            }
        })
    }
    public animateMoveDown () {
        this.svg.move({ duration: 1000, direction: { x: 0, y: 30 } })
    }
}
