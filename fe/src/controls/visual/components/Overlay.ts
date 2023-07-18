import { SvgComponent } from './base/SvgComponent'
import Consts from '@/utils/svgBoardConstants'

export class Overlay extends SvgComponent {
    public render(): void {
        this.clear()
        this.svg.createChild({
            type: 'rect',
            center: { x: Consts.BOARD.SIZE.X / 2, y: Consts.BOARD.SIZE.Y / 2 },
            size: { x: Consts.BOARD.SIZE.X, y: Consts.BOARD.SIZE.Y },
            color: '#777',
            opacity: 0.8
        })
    }
}
