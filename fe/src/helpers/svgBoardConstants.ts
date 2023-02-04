import { PlayerColors } from "../types"

export const FIGURE_PATH = 'M 0 45 C 5 50 15 50 20 45 C 20 35 15 30 15 20 C 15 15 20 15 20 10 C 20 5 15 0 10 0 C 5 0 0 5 0 10 C 0 15 5 15 5 20 C 5 30 0 35 0 45'

export default {
    K: 2.75,
    COLORS: {
        [PlayerColors.RED]: {
            front: '#de0000',
            back: '#730505',
            highlight: '#ef8b8b',
            shadow: '#ff4d4d'
        },
        [PlayerColors.GREEN]: {
            front: '#088714',
            back: '#03540b',
            highlight: '#84ca8b',
            shadow: '#3aab45'
        },
        [PlayerColors.YELLOW]: {
            front: '#bab70d',
            back: '#7a5f05',
            highlight: '#f4f287',
            shadow: '#dfd91b'
        },
        [PlayerColors.BLUE]: {
            front: '#0576ab',
            back: '#023852',
            highlight: '#7feeee',
            shadow: '#0698dd'
        },
        HIGHLIGHT: {
            highlight: '#9c5300',
            front: '#fc9c2d',
            back: '#9c5300',
            shadow: '#ffbc6e'
        }
    },
    BOARD: {
        SIZE: 315,
        FIELDS: {
            OUTER_SIZE: 20,
            INNER_SIZE: 18,
            GAP: 4
        },
        FRAMES: {
            GREEN: {
                COLOR: '#108c0e',
                SIZE: 315
            },
            RED: {
                COLOR: '#ed2121',
                SIZE: 286,
                CORNERS: {
                    DIAMETER: 61,
                    OFFSET: 34
                }
            },
            YELLOW: {
                SIZE: 274,
                COLOR: '#d6c66d',
                CORNERS: {
                    DIAMETER: 49,
                    OFFSET: 34
                }
            }
        },
        DICE: {
            OUTER_SIZE: 65,
            INNER_SIZE: 63,
            DOT_SIZE: 20
        },
        NO_MOVES_MODAL: {
            WIDTH: 110,
            HEIGHT: 70,
            INITIAL_OFFSET: 50
        }
    },
} as const
