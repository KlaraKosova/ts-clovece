import { Coordinates } from '../types/Coordinates'
import { PlayerColors } from '../types/PlayerColors'
import Consts from './svgBoardConstants'

const centers = [] as Coordinates[]

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
  ]}

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

// TODO refactor
const iterator = {
  x: 38,      // start position x
  y: 133.5,   // start position y
  move: 'x' as 'x' | 'y',
  direction: 'increase' as 'increase' | 'decrease',
  increase: function (axis: 'x' | 'y', space: boolean) {
    this[axis] += space ? Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP : Consts.BOARD.FIELDS.OUTER_SIZE
  },
  decrease: function (axis: 'x' | 'y', space: boolean) {
    this[axis] -= space ? Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP : Consts.BOARD.FIELDS.OUTER_SIZE
  },
  alternate: function () {
    this[this.direction](this.move, true)
    this.flipAxis()
  },
  flipAxis: function () {
    this.move = this.move === 'x' ? 'y' : 'x'
  },
  flipDirection: function () {
    this.direction = this.direction === 'increase' ? 'decrease' : 'increase'
  }
}

for (let i = 0; i < 4; i++) {
  if (i === 2) {
    iterator.flipDirection()
  }
  for (let j = 0; j < 5; j++) {
    if (j !== 0) {
      iterator[iterator.direction](iterator.move, true)
    }
    centers.push({
      x: iterator.x,
      y: iterator.y
    })
  }
  iterator.flipAxis()
  if (i % 2 === 0) {
    iterator.flipDirection()
  }
  iterator[iterator.direction](iterator.move, true)
  centers.push({
    x: iterator.x,
    y: iterator.y
  })
  for (let j = 0; j < 3; j++) {
    iterator[iterator.direction](iterator.move, j !== 3)
    centers.push({
      x: iterator.x,
      y: iterator.y
    })
  }
  iterator.flipAxis()
  if (i % 2 === 0) {
    iterator.flipDirection()
  }
  iterator[iterator.direction](iterator.move, true)
  centers.push({
    x: iterator.x,
    y: iterator.y
  })
  iterator.alternate()
}

export {
  centers,
  startCenters,
  homeCenters
}
