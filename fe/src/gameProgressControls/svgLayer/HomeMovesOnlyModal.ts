import { GameElement } from "./base/GameElement";
import Consts from "../../utils/svgBoardConstants"

export class HomeMovesOnlyModal extends GameElement {
    render() {
        this.svg.createChild({
            type: 'rect',
            size: {
                x: Consts.BOARD.HOME_MOVES_ONLY_MODAL.WIDTH,
                y: Consts.BOARD.HOME_MOVES_ONLY_MODAL.HEIGHT
            },
            radius: 10,
            center: {
                x: Consts.BOARD.SIZE / 2,
                y: Consts.BOARD.SIZE / 2 - Consts.BOARD.HOME_MOVES_ONLY_MODAL.INITIAL_OFFSET
            },
            color: '#fff'
        })

        this.svg.createChild({
            type: 'text',
            text: 'Omezene dostupne tahy', // TODO better text
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 - 15 - Consts.BOARD.HOME_MOVES_ONLY_MODAL.INITIAL_OFFSET },
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
                y: Consts.BOARD.HOME_MOVES_ONLY_MODAL.INITIAL_OFFSET
            }
        })
    }
}
