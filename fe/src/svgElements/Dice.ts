import {GameElement} from "./GameElement";
import Consts from '../helpers/svgBoardConstants'

const dotsConfig = [
    [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 0, 0],
        [1, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0]
    ],
    [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1]
    ],
    [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
    ],
    [
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1]
    ]
]

export class Dice extends GameElement {
    render (): void {
        this.drawDots(6)
    }

    /* animate (fn: (elem: Element) => void): void {
        if (!this.diceSvg) {
            // TODO
            throw new Error()
        }
        this.diceSvg.callChildrenFn(fn, [0])
    } */

    private drawDots (dots: number): void {
        this.svg.createChild({
            type: "rect",
            center: {x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2},
            size: { x: Consts.BOARD.SIZE, y: Consts.BOARD.SIZE},
            color: '#777',
            opacity: 0.8
        })
        this.svg.createChild({
            type: "rect",
            center: {x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2},
            size: { x: Consts.BOARD.DICE.OUTER_SIZE, y: Consts.BOARD.DICE.OUTER_SIZE},
            color: '#000',
            radius: 10
        }, 'svg_dice')
        this.svg.createChild({
            type: "rect",
            center: {x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2},
            size: { x: Consts.BOARD.DICE.INNER_SIZE, y: Consts.BOARD.DICE.INNER_SIZE},
            color: '#fff',
            radius: 10
        })

        const numberConfig = dotsConfig[dots - 1]
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (numberConfig[i][j]) {
                    this.svg.createChild({
                        type: 'circle',
                        diameter: 16,
                        color: '#000',
                        center: {
                            x: Consts.BOARD.SIZE / 2 - Consts.BOARD.DICE.DOT_SIZE + Consts.BOARD.DICE.DOT_SIZE * j,
                            y: Consts.BOARD.SIZE / 2 - Consts.BOARD.DICE.DOT_SIZE + Consts.BOARD.DICE.DOT_SIZE * i
                        }
                    })
                }
            }
        }
    }

    /* async animateDotsSequence (sequence: number[]): Promise<void> {
        if (!this.playBtnSvg) {
            // TODO
            throw new Error()
        }
        for (let i = 0; i < sequence.length; i++) {
            this.drawDots(sequence[i])
            await delay(25)
        }

        this.playBtnSvg.createChild({
            type: 'rect',
            color: '#108c0e',
            size: {
                x: 50,
                y: 50
            },
            radius: 15,
            center: { x: 157.5, y: 157.5 }
        })
        this.playBtnSvg.createChild({
            type: 'text',
            text: '>',
            center: { x: BOARD_CENTER, y: BOARD_CENTER },
            font: {
                weight: 'bold',
                size: '2rem'
            }
        })

        this.animate((child: Element) => {
            child.animate(1000, 0, 'after').dmove(0, -30 * k)
        })
        this.playBtnSvg.callChildrenFn((child: Element) => {
            child.animate(1000, 0, 'after').dmove(0, 30 * k)
        })
    }

    clear (): void {
        if (this.diceSvg) {
            console.log(this.diceSvg)
            this.diceSvg.removeChildren()
        }
        if (this.playBtnSvg) {
            console.log(this.diceSvg)
            this.playBtnSvg.removeChildren()
        }
    } */
}
