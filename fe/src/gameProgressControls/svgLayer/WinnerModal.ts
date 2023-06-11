import { GameElement } from "./base/GameElement";
import Consts from "../../utils/svgBoardConstants"
import { Runner, Svg } from "@svgdotjs/svg.js";
import { PlayerColors } from "@/types/common/PlayerColors";

export class WinnerModal extends GameElement {
    private animationRunners: Runner[]
    private color: PlayerColors | null = null

    constructor(draw: Svg) {
        super(draw);
        /* this.animationRunners = []
        for (let i = 0; i < 3; i++) {
            this.animationRunners[i] = new Runner()
        } */
    }

    public setColor( color: PlayerColors) {
        this.color = color
    }

    public render() {
        if (this.color === null) {
            throw new Error("debug")
        }

        const figureColor = Consts.COLORS[this.color]
        const figureInitialPosition = {
            x: Consts.BOARD.WINNER_MODAL.FIGURE_INITIAL_POSITION.X,
            y: Consts.BOARD.WINNER_MODAL.FIGURE_INITIAL_POSITION.Y,
        }
        this.svg.createChild({
            type: 'path',
            path: Consts.FIGURE.RELATIVE_PATH.OUTLINE,
            initialPosition: figureInitialPosition,
            color: figureColor.FIGURE_BODY,
            pathScale: Consts.BOARD.WINNER_MODAL.FIGURE_SCALE
        })

        this.svg.createChild({
            type: 'path',
            path: Consts.FIGURE.RELATIVE_PATH.HIGHLIGHT,
            initialPosition: figureInitialPosition,
            color: figureColor.FIGURE_HIGHLIGHT,
            pathScale: Consts.BOARD.WINNER_MODAL.FIGURE_SCALE
        })
    }

    public runAnimation() {
    }

    clear() {
        for (let i = 0; i < 3; i++) {
            this.animationRunners[i].finish()
        }
        super.clear();
    }
}
