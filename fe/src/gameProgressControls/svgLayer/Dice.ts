import { GameElement } from "./base/GameElement";
import Consts from '../../utils/svgBoardConstants'
import { delay } from "../../utils/common";
import { Element, Svg } from "@svgdotjs/svg.js";

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
    constructor(draw: Svg) {
        super(draw);
        this.svg.setDataset({ dice: true })
    }

    render(): void {
        this.drawDots(6)
        this.svg.setCSS({
            cursor: 'pointer'
        })
    }

    private drawDots(dots: number): void {
        this.svg.createChild({
            type: "rect",
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 },
            size: { x: Consts.BOARD.DICE.OUTER_SIZE, y: Consts.BOARD.DICE.OUTER_SIZE },
            color: '#000',
            radius: 10
        })
        this.svg.createChild({
            type: "rect",
            center: { x: Consts.BOARD.SIZE / 2, y: Consts.BOARD.SIZE / 2 },
            size: { x: Consts.BOARD.DICE.INNER_SIZE, y: Consts.BOARD.DICE.INNER_SIZE },
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

    async animateDotsSequence(sequence: number[]): Promise<void> {
        for (let i = 0; i < sequence.length; i++) {
            this.drawDots(sequence[i])
            await delay(25)
        }
    }

    public async animateMoveUp() {
        this.svg.move({ duration: 1000, offset: { x: 0, y: -30 } })
        this.svg.setCSS({
            cursor: 'default'
        })
    }
}
