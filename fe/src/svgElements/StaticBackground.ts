import { GameElement } from "./GameElement";
import Consts from "../helpers/svgBoardConstants";

export class StaticBackground extends GameElement {
    render(): void {
        // Green frame
        this.svg.createChild({
            type: 'rect',
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 },
            color: Consts.BOARD.FRAMES.GREEN.COLOR,
            size: { x: Consts.BOARD.FRAMES.GREEN.SIZE, y: Consts.BOARD.FRAMES.GREEN.SIZE }
        })

        // Red frame
        this.svg.createChild({
            type: 'rect',
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 },
            color: Consts.BOARD.FRAMES.RED.COLOR,
            size: { x: Consts.BOARD.FRAMES.RED.SIZE, y: Consts.BOARD.FRAMES.RED.SIZE }
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.RED.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.FRAMES.RED.CORNERS.OFFSET, y: Consts.BOARD.FRAMES.RED.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.RED.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.RED.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.SIZE - Consts.BOARD.FRAMES.RED.CORNERS.OFFSET, y: Consts.BOARD.FRAMES.RED.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.RED.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.RED.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.SIZE - Consts.BOARD.FRAMES.RED.CORNERS.OFFSET, y: Consts.BOARD.SIZE - Consts.BOARD.FRAMES.RED.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.RED.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.RED.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.FRAMES.RED.CORNERS.OFFSET, y: Consts.BOARD.SIZE - Consts.BOARD.FRAMES.RED.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.RED.COLOR
        })

        // Yellow frame
        this.svg.createChild({
            type: 'rect',
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 },
            color: Consts.BOARD.FRAMES.YELLOW.COLOR,
            size: { x: Consts.BOARD.FRAMES.YELLOW.SIZE, y: Consts.BOARD.FRAMES.YELLOW.SIZE }
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.YELLOW.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET, y: Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.YELLOW.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.YELLOW.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.SIZE - Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET, y: Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.YELLOW.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.YELLOW.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.SIZE - Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET, y: Consts.BOARD.SIZE - Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.YELLOW.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.YELLOW.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET, y: Consts.BOARD.SIZE - Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.YELLOW.COLOR
        })
    }
}