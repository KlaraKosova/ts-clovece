import { SvgComponent } from './base/SvgComponent'
import Consts from '@/utils/svgBoardConstants'
import { Runner, type Svg } from '@svgdotjs/svg.js'
import { ViewNames } from '@/types/ViewName'
import { type Coordinates } from '@/types/Coordinates'

export class Loading extends SvgComponent {
    private animationRunners: Runner[]
    private readonly containerSize: Coordinates

    constructor(draw: Svg, viewType: ViewNames) {
        super(draw)
        this.animationRunners = []
        for (let i = 0; i < 3; i++) {
            this.animationRunners[i] = new Runner()
        }

        if (viewType === ViewNames.LOADING || viewType === ViewNames.GAME_WAITING) {
            this.containerSize = {
                x: Consts.LOADING_VIEW.SIZE.X,
                y: Consts.LOADING_VIEW.SIZE.Y
            }
        } else {
            this.containerSize = {
                x: Consts.BOARD.SIZE.X,
                y: Consts.BOARD.SIZE.Y
            }
        }
    }

    public render(): void {
        for (let i = 0; i < 3; i++) {
            this.svg.createChild({
                type: 'circle',
                center: { x: this.containerSize.x / 2 - 30, y: this.containerSize.y / 2 },
                diameter: 5,
                color: '#fff'
            })
        }
    }

    public runAnimation(): void {
        for (let i = 0; i < 3; i++) {
            this.animationRunners[i] = this.svg.getNthChild(i + 1)
                .animate({
                    duration: 1000,
                    delay: 100 * i,
                    when: 'now',
                    swing: true,
                    times: Infinity,
                    wait: 1150
                })
                .center((this.containerSize.x / 2 + 30) * Consts.K, (this.containerSize.y / 2) * Consts.K)
        }
    }

    clear(): void {
        for (let i = 0; i < 3; i++) {
            this.animationRunners[i].finish()
        }
        super.clear()
    }
}
