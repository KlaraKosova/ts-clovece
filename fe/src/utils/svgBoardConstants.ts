import { PlayerColors } from '../types/PlayerColors'
const K = 2.6
export default {
    K,
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
            FIGURE_BODY: '#9c5300'
        },
        CROWN: {
            BACK: '#f0bd30'
        },
        SUCCESS_COLOR: '#108c0e',
        FAILURE_COLOR: '#ed2121'
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
        WINNER_MODAL: {
            FIGURE_INITIAL_POSITION: {
                X: 315 / 2,
                Y: 315 / 2 + 40
            },
            INNER_SIZE: {
                X: 100,
                Y: 120
            },
            OUTER_SIZE: {
                X: 110,
                Y: 130
            },
            BORDER_RADIUS: 10,
            ELEMENT_SCALE: 8,
            FIGURE_SHADOW_OFFSET: {
                X: 10,
                Y: 5
            }
        }
    },
    ELEMENTS: {
        SUCCESS_COLOR: '#108c0e',
        FAILURE_COLOR: '#ed2121',
        PLAY_BUTTON: {
            WIDTH: 50,
            HEIGHT: 20,
            RADIUS: 10
        }
    },
    FIGURE: {
    // prefix 'M x y', where x, y is figure position center
        RELATIVE_PATH: {
            OUTLINE: 'm -9 3 c 6 3 12 3 18 0 c 0 -6 -4 -10 -6 -15 c 1 -2 3 -3 3 -6 c 0 -3 -3 -6 -6 -6 c -3 0 -6 3 -6 6 c 0 3 2 4 3 6 c -2 5 -6 9 -6 15',
            HIGHLIGHT: 'm -2 -23 c -2 0 -5 6 -3 6 c 1 0 4 -6 3 -6'
        }
    },
    CROWN: {
    // prefix 'M x y', where x, y is figure position center
        RELATIVE_PATH: {
            OUTLINE: 'm 0 -30 l -6.5 0 l -2.5 -8 c 1.3333 0.6667 2 2 4 2 c 1 0 1 0 1.5 -0.5 c 1.5 -1.5 2.3333 -3.6667 3.5 -5.5 c 1.1667 1.8333 2 4 3.5 5.5 c 0.5 0.5 0.5 0.5 1.5 0.5 c 2 0 2.6667 -1.3333 4 -2 l -2.5 8 l -6.5 0 z m -8.75 -9 c 1 0 1 1 1 1 c 0 0 0 1 -1 1 c 0 0 -1 0 -1 -1 c 0 -1 1 -1 1 -1 z m 17.5 0 c 1 0 1 1 1 1 c 0 0 0 1 -1 1 c 0 0 -1 0 -1 -1 c 0 0 0 -1 1 -1 z m -8.75 -4 c 1 0 1 1 1 1 c 0 0 0 1 -1 1 c 0 0 -1 0 -1 -1 c 0 0 0 -1 1 -1 z'
        },
        INITIAL_OFFSET: {
            X: 0,
            Y: 10 * 8 * 0.75
        }
    }
} as const
