import { SvgComponent } from './base/SvgComponent'
import { type Svg } from '@svgdotjs/svg.js'
import Consts from '@/utils/svgBoardConstants'

export class DicePlayButton extends SvgComponent {
    constructor(draw: Svg) {
        super(draw)
        this.svg.setDataset({ playButton: true })
        this.svg.setCSS({
            cursor: 'pointer'
        })
    }

    public render(): void {
        this.svg.createChild({
            type: 'rect',
            center: { x: Consts.BOARD.SIZE.X / 2, y: Consts.BOARD.SIZE.Y / 2 },
            color: '#fff',
            size: { x: Consts.ELEMENTS.PLAY_BUTTON.WIDTH, y: Consts.ELEMENTS.PLAY_BUTTON.HEIGHT },
            radius: Consts.ELEMENTS.PLAY_BUTTON.RADIUS
        })
        this.svg.createChild({
            type: 'text',
            text: '>', // TODO fix unicode
            center: { x: Consts.BOARD.SIZE.X / 2, y: Consts.BOARD.SIZE.Y / 2 },
            font: {
                weight: 'bold',
                size: '2rem',
                fill: Consts.ELEMENTS.SUCCESS_COLOR
            }
        })
    }

    public async animateMoveDown(): Promise<void> {
        await this.svg.move({ duration: 1000, offset: { x: 0, y: 30 } })
    }
}
