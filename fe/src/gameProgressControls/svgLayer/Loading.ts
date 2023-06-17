import { GameElement } from './base/GameElement'
import Consts from '../../utils/svgBoardConstants'
import { Runner, type Svg } from '@svgdotjs/svg.js'

export class Loading extends GameElement {
    private animationRunners: Runner[]

    constructor(draw: Svg) {
        super(draw)
        this.animationRunners = []
        for (let i = 0; i < 3; i++) {
            this.animationRunners[i] = new Runner()
        }
    }

    public render(): void {
        for (let i = 0; i < 3; i++) {
            this.svg.createChild({
                type: 'circle',
                center: { x: Consts.BOARD.SIZE / 2 - 30, y: Consts.BOARD.SIZE / 2 },
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
                .center((Consts.BOARD.SIZE / 2 + 30) * Consts.K, (Consts.BOARD.SIZE / 2) * Consts.K)
        }
    }

    clear(): void {
        for (let i = 0; i < 3; i++) {
            this.animationRunners[i].finish()
        }
        super.clear()
    }
}
