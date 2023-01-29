import { PlayerColors } from "../types"

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
        }
    },
} as const
