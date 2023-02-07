import { GameElement } from "../GameElement";
import { Svg } from "@svgdotjs/svg.js";
import Consts from "../../../helpers/svgBoardConstants"

export class DicePlayButton extends GameElement {
    constructor(draw: Svg) {
        super(draw);
        this.svg.setDataset({ playButton: true })
    }
    public render() {
        this.svg.createChild({
            type: 'rect',
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 },
            color: '#fff',
            size: { x: Consts.ELEMENTS.PLAY_BUTTON.WIDTH, y: Consts.ELEMENTS.PLAY_BUTTON.HEIGHT },
            radius: Consts.ELEMENTS.PLAY_BUTTON.RADIUS
        })
        this.svg.createChild({
            type: 'text',
            text: '\u{1F80A}',
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 },
            font: {
                weight: 'bold',
                size: '2rem',
                fill: Consts.ELEMENTS.SUCCESS_COLOR,
            },
        })
    }
    public animateMoveDown() {
        this.svg.move({ duration: 1000, offset: { x: 0, y: 30 } })
    }

    private registerListeners() {
        // this.svg.
    }
    private onMouseEnter() {

    }

    private onMouseLeave() { }
}
