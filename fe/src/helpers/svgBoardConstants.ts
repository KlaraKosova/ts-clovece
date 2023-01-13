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
            figureTop: '#84ca8b',
            figureBottom: '#3aab45'
        },
        [PlayerColors.YELLOW]: {
            front: '#bab70d',
            back: '#7a5f05',
            figureTop: '#f4f287',
            figureBottom: '#dfd91b'
        },
        [PlayerColors.BLUE]: {
            front: '#0576ab',
            back: '#023852',
            figureTop: '#7feeee',
            figureBottom: '#0698dd'
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
        }
    },
} as const