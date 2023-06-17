import { type Coordinates } from '../types/Coordinates'
import { PlayerColors } from '../types/PlayerColors'
import Consts from './svgBoardConstants'

// TODO constants
const startCenters: Record<PlayerColors, Coordinates[]> = {
    [PlayerColors.RED]: [
        { x: 54, y: 34 },
        { x: 74 + 4, y: 34 },
        { x: 34, y: 54 },
        { x: 34, y: 74 + 4 }
    ],
    [PlayerColors.YELLOW]: [
        { x: 315 - 54, y: 34 },
        { x: 315 - 74 - 4, y: 34 },
        { x: 315 - 34, y: 54 },
        { x: 315 - 34, y: 74 + 4 }
    ],
    [PlayerColors.GREEN]: [
        { x: 315 - 54, y: 315 - 34 },
        { x: 315 - 74 - 4, y: 315 - 34 },
        { x: 315 - 34, y: 315 - 54 },
        { x: 315 - 34, y: 315 - 74 - 4 }
    ],
    [PlayerColors.BLUE]: [
        { x: 54, y: 315 - 34 },
        { x: 74 + 4, y: 315 - 34 },
        { x: 34, y: 315 - 54 },
        { x: 34, y: 315 - 74 - 4 }
    ]
}

const homeCenters: Record<PlayerColors, Coordinates[]> = {
    [PlayerColors.RED]: [
        { x: 38 + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP, y: 157.5 },
        { x: 38 + 40 + 8, y: 157.5 },
        { x: 38 + 60 + 12, y: 157.5 },
        { x: 38 + 80 + 16, y: 157.5 }
    ],
    [PlayerColors.YELLOW]: [
        { x: 157.5, y: 38 + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP },
        { x: 157.5, y: 38 + 40 + 8 },
        { x: 157.5, y: 38 + 60 + 12 },
        { x: 157.5, y: 38 + 80 + 16 }
    ],
    [PlayerColors.GREEN]: [
        { x: 315 - (38 + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP), y: 157.5 },
        { x: 315 - (38 + 40 + 8), y: 157.5 },
        { x: 315 - (38 + 60 + 12), y: 157.5 },
        { x: 315 - (38 + 80 + 16), y: 157.5 }
    ],
    [PlayerColors.BLUE]: [
        { x: 157.5, y: 315 - (38 + Consts.BOARD.FIELDS.OUTER_SIZE + 4) },
        { x: 157.5, y: 315 - (38 + 40 + 8) },
        { x: 157.5, y: 315 - (38 + 60 + 12) },
        { x: 157.5, y: 315 - (38 + 80 + 16) }
    ]
}

class MainFieldsGenerator {
    private readonly currentCoordinates: Coordinates = {
        x: 38, // start position x
        y: 133.5 // start position y
    }

    private moveAxis: keyof Coordinates = 'x'
    private moveDirection: 'increase' | 'decrease' = 'increase'

    private increase(axis: keyof Coordinates, addSpace: boolean): void {
        this.currentCoordinates[axis] += addSpace ? Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP : Consts.BOARD.FIELDS.OUTER_SIZE
    }

    private decrease (axis: keyof Coordinates, space: boolean): void {
        this.currentCoordinates[axis] -= space ? Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP : Consts.BOARD.FIELDS.OUTER_SIZE
    }

    private alternate(): void {
        this[this.moveDirection](this.moveAxis, true)
        this.flipAxis()
    }

    private flipAxis(): void {
        this.moveAxis = this.moveAxis === 'x' ? 'y' : 'x'
    }

    private flipDirection(): void {
        this.moveDirection = this.moveDirection === 'increase' ? 'decrease' : 'increase'
    }

    public generate(): Coordinates[] {
        const result = [] as Coordinates[]

        for (let i = 0; i < 4; i++) {
            if (i === 2) {
                this.flipDirection()
            }
            for (let j = 0; j < 5; j++) {
                if (j !== 0) {
                    this[this.moveDirection](this.moveAxis, true)
                }
                centers.push({
                    x: this.currentCoordinates.x,
                    y: this.currentCoordinates.y
                })
            }
            this.flipAxis()
            if (i % 2 === 0) {
                this.flipDirection()
            }
            this[this.moveDirection](this.moveAxis, true)
            centers.push({
                x: this.currentCoordinates.x,
                y: this.currentCoordinates.y
            })
            for (let j = 0; j < 3; j++) {
                this[this.moveDirection](this.moveAxis, j !== 3)
                centers.push({
                    x: this.currentCoordinates.x,
                    y: this.currentCoordinates.y
                })
            }
            this.flipAxis()
            if (i % 2 === 0) {
                this.flipDirection()
            }
            this[this.moveDirection](this.moveAxis, true)
            centers.push({
                x: this.currentCoordinates.x,
                y: this.currentCoordinates.y
            })
            this.alternate()
        }

        return result
    }
}

const generator = new MainFieldsGenerator()
const centers = generator.generate()

export {
    centers,
    startCenters,
    homeCenters
}
