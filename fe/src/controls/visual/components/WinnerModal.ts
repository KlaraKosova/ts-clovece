import { SvgComponent } from './base/SvgComponent'
import Consts from '@/utils/svgBoardConstants'
import { Runner, type Svg } from '@svgdotjs/svg.js'
import { type PlayerColors } from '@/types/PlayerColors'
import { delay } from '@/utils/common'

export class WinnerModal extends SvgComponent {
    private animationRunners: Runner[]
    private winnerColor: PlayerColors | null = null
    private playerColor: PlayerColors | null = null

    constructor(draw: Svg) {
        super(draw)
        this.animationRunners = []
        for (let i = 0; i < 4; i++) {
            this.animationRunners[i] = new Runner()
        }
    }

    public setWinnerColor(color: PlayerColors): void {
        this.winnerColor = color
    }

    public setPlayerColor(color: PlayerColors): void {
        this.playerColor = color
    }

    public render(): void {
        if (this.winnerColor === null || this.playerColor === null) {
            throw new Error('Winner of current player color not set')
        }

        const frameColor = this.winnerColor === this.playerColor ? Consts.COLORS.SUCCESS_COLOR : Consts.COLORS.FAILURE_COLOR

        const figureColor = Consts.COLORS[this.winnerColor]
        const figureInitialPosition = {
            x: Consts.BOARD.WINNER_MODAL.FIGURE_INITIAL_POSITION.X,
            y: Consts.BOARD.WINNER_MODAL.FIGURE_INITIAL_POSITION.Y
        }

        this.svg.createChild({
            type: 'rect',
            center: {
                x: Consts.BOARD.SIZE.X / 2,
                y: Consts.BOARD.SIZE.Y / 2
            },
            color: frameColor,
            radius: Consts.BOARD.WINNER_MODAL.BORDER_RADIUS,
            size: {
                x: Consts.BOARD.WINNER_MODAL.OUTER_SIZE.X,
                y: Consts.BOARD.WINNER_MODAL.OUTER_SIZE.Y
            }
        })

        this.svg.createChild({
            type: 'rect',
            center: {
                x: Consts.BOARD.SIZE.X / 2,
                y: Consts.BOARD.SIZE.Y / 2
            },
            color: '#fff',
            radius: Consts.BOARD.WINNER_MODAL.BORDER_RADIUS,
            size: {
                x: Consts.BOARD.WINNER_MODAL.INNER_SIZE.X,
                y: Consts.BOARD.WINNER_MODAL.INNER_SIZE.Y
            }
        })

        this.svg.createChild({
            type: 'ellipse',
            center: {
                x: Consts.BOARD.WINNER_MODAL.FIGURE_INITIAL_POSITION.X + Consts.BOARD.WINNER_MODAL.FIGURE_SHADOW_OFFSET.X,
                y: Consts.BOARD.WINNER_MODAL.FIGURE_INITIAL_POSITION.Y + Consts.BOARD.WINNER_MODAL.FIGURE_SHADOW_OFFSET.Y
            },
            color: '#aaa',
            ellipseRadius: {
                x: 6 * Consts.BOARD.WINNER_MODAL.ELEMENT_SCALE,
                y: 15
            }
        })

        this.svg.createChild({
            type: 'path',
            path: Consts.FIGURE.RELATIVE_PATH.OUTLINE,
            initialPosition: figureInitialPosition,
            color: figureColor.FIGURE_BODY,
            pathScale: Consts.BOARD.WINNER_MODAL.ELEMENT_SCALE
        })

        this.svg.createChild({
            type: 'path',
            path: Consts.FIGURE.RELATIVE_PATH.HIGHLIGHT,
            initialPosition: figureInitialPosition,
            color: figureColor.FIGURE_HIGHLIGHT,
            pathScale: Consts.BOARD.WINNER_MODAL.ELEMENT_SCALE
        })

        for (let i = 0; i < 5; i++) {
            this.svg.getNthChild(i + 1).scale(0.001)
        }
    }

    public async runAnimation(): Promise<void> {
        for (let i = 0; i < 5; i++) {
            this.animationRunners[i] =
                this.svg.getNthChild(i + 1).animate({
                    duration: 500,
                    delay: 0,
                    when: 'now',
                    swing: true,
                    times: 1,
                    wait: 0
                }).transform({ scale: 1 })
        }

        await delay(500)

        this.svg.createChild({
            type: 'path',
            path: Consts.CROWN.RELATIVE_PATH.OUTLINE,
            initialPosition: {
                x: Consts.BOARD.WINNER_MODAL.FIGURE_INITIAL_POSITION.X,
                y: Consts.BOARD.WINNER_MODAL.FIGURE_INITIAL_POSITION.Y
            },
            color: Consts.COLORS.CROWN.BACK,
            pathScale: Consts.BOARD.WINNER_MODAL.ELEMENT_SCALE
        })

        this.animationRunners[5] = this.svg.getNthChild(6).animate({
            duration: 400,
            delay: 0,
            when: 'now',
            swing: true,
            times: 1,
            wait: 0
        }).dmove(Consts.CROWN.INITIAL_OFFSET.X, Consts.CROWN.INITIAL_OFFSET.Y).ease('<')

        await delay(400)
        this.animationRunners[5].animate({
            duration: 500,
            delay: 0,
            when: 'now',
            swing: true,
            times: 1,
            wait: 0
        }).transform({ rotate: 10 }).dmove(-1 * Consts.BOARD.WINNER_MODAL.ELEMENT_SCALE, 0)
    }

    clear(): void {
        for (let i = 0; i < 3; i++) {
            this.animationRunners[i].finish()
        }
        super.clear()
    }
}
