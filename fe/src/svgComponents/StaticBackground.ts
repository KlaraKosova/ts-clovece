import { SvgComponent } from './base/SvgComponent'
import Consts from '../utils/svgBoardConstants'

export class StaticBackground extends SvgComponent {
    render(): void {
    // Green frame
        this.svg.createChild({
            type: 'rect',
            center: { x: Consts.BOARD.SIZE.X / 2, y: Consts.BOARD.SIZE.Y / 2 },
            color: Consts.BOARD.FRAMES.GREEN.COLOR,
            size: { x: Consts.BOARD.FRAMES.GREEN.SIZE, y: Consts.BOARD.FRAMES.GREEN.SIZE }
        })

        // Red frame
        this.svg.createChild({
            type: 'rect',
            center: { x: Consts.BOARD.SIZE.X / 2, y: Consts.BOARD.SIZE.Y / 2 },
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
            center: { x: Consts.BOARD.SIZE.X - Consts.BOARD.FRAMES.RED.CORNERS.OFFSET, y: Consts.BOARD.FRAMES.RED.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.RED.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.RED.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.SIZE.X - Consts.BOARD.FRAMES.RED.CORNERS.OFFSET, y: Consts.BOARD.SIZE.Y - Consts.BOARD.FRAMES.RED.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.RED.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.RED.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.FRAMES.RED.CORNERS.OFFSET, y: Consts.BOARD.SIZE.Y - Consts.BOARD.FRAMES.RED.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.RED.COLOR
        })

        // Yellow frame
        this.svg.createChild({
            type: 'rect',
            center: { x: Consts.BOARD.SIZE.X / 2, y: Consts.BOARD.SIZE.Y / 2 },
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
            center: { x: Consts.BOARD.SIZE.X - Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET, y: Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.YELLOW.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.YELLOW.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.SIZE.X - Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET, y: Consts.BOARD.SIZE.Y - Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.YELLOW.COLOR
        })
        this.svg.createChild({
            type: 'circle',
            diameter: Consts.BOARD.FRAMES.YELLOW.CORNERS.DIAMETER,
            center: { x: Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET, y: Consts.BOARD.SIZE.Y - Consts.BOARD.FRAMES.YELLOW.CORNERS.OFFSET },
            color: Consts.BOARD.FRAMES.YELLOW.COLOR
        })
    }
}
