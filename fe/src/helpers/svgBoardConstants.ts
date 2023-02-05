import { PlayerColors } from "../types"

export default {
    K: 2.8,
    COLORS: {
        [PlayerColors.RED]: {
            FIELD_FRONT: '#de0000',
            FIELD_BACK: '#730505',
            FIGURE_HIGHLIGHT: '#ef8b8b',
            FIGURE_BODY: '#ff4d4d'
        },
        [PlayerColors.GREEN]: {
            FIELD_FRONT: '#088714',
            FIELD_BACK: '#03540b',
            FIGURE_HIGHLIGHT: '#84ca8b',
            FIGURE_BODY: '#3aab45'
        },
        [PlayerColors.YELLOW]: {
            FIELD_FRONT: '#bab70d',
            FIELD_BACK: '#7a5f05',
            FIGURE_HIGHLIGHT: '#f4f287',
            FIGURE_BODY: '#dfd91b'
        },
        [PlayerColors.BLUE]: {
            FIELD_FRONT: '#0576ab',
            FIELD_BACK: '#023852',
            FIGURE_HIGHLIGHT: '#7feeee',
            FIGURE_BODY: '#0698dd'
        },
        HIGHLIGHT: {
            FIELD_FRONT: '#fc9c2d',
            FIELD_BACK: '#9c5300',
            FIGURE_HIGHLIGHT: '#ffbc6e',
            FIGURE_BODY: '#9c5300',
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
    FIGURE: {
        // prefix 'M x y', kde x, y je stred aktualniho pole
        RELATIVE_PATH: {
            OUTLINE: 'm -9 3 c 6 3 12 3 18 0 c 0 -6 -4 -10 -6 -15 c 1 -2 3 -3 3 -6 c 0 -3 -3 -6 -6 -6 c -3 0 -6 3 -6 6 c 0 3 2 4 3 6 c -2 5 -6 9 -6 15',
            HIGHLIGHT: 'm -2 -23 c -2 0 -5 6 -3 6 c 1 0 4 -6 3 -6'
        }
    }
} as const
