import {GameElement} from "../GameElement";
import Consts from "../../helpers/svgBoardConstants";

export class Overlay extends GameElement{
    public render() {
        this.svg.createChild({
            type: "rect",
            center: {x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2},
            size: { x: Consts.BOARD.SIZE, y: Consts.BOARD.SIZE},
            color: '#777',
            opacity: 0.8
        })
    }
}
