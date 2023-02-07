import { GameElement } from "../GameElement";
import Consts from "../../../helpers/svgBoardConstants"

export class NoMovesModal extends GameElement {
    render() {
        this.svg.createChild({
            type: 'rect',
            size: {
                x: Consts.BOARD.NO_MOVES_MODAL.WIDTH,
                y: Consts.BOARD.NO_MOVES_MODAL.HEIGHT
            },
            radius: 10,
            center: {
                x: Consts.BOARD.SIZE / 2,
                y: Consts.BOARD.SIZE / 2 - Consts.BOARD.NO_MOVES_MODAL.INITIAL_OFFSET
            },
            color: '#fff'
        })

        this.svg.createChild({
            type: 'text',
            text: 'Zadne dalsi tahy',
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 - 15 - Consts.BOARD.NO_MOVES_MODAL.INITIAL_OFFSET },
            font: {
                size: '1.5rem'
            }
        })
    }
    public async moveDown() {
        await this.svg.move({
            duration: 500,
            offset: {
                x: 0,
                y: Consts.BOARD.NO_MOVES_MODAL.INITIAL_OFFSET
            }
        })
    }
}
