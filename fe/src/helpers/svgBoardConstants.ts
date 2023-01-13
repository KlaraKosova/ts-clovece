export default {
    K: 2.75,
    COLORS: {
        RED: {
            front: '#de0000',
            back: '#730505',
            highlight: '#ef8b8b',
            shadow: '#ff4d4d'
        },
        GREEN: {
            front: '#088714', // '#099617',
            back: '#03540b',
            figureTop: '#84ca8b',
            figureBottom: '#3aab45'
        },
        YELLOW: {
            front: '#bab70d',
            back: '#7a5f05',
            figureTop: '#f4f287',
            figureBottom: '#dfd91b'
        },
        BLUE: {
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
                SIZE: 328
            },
            RED: {
                COLOR: '#ed2121',
                SIZE: 294,
                CORNERS: {
                    DIAMETER: 69,
                    OFFSET: 40
                }
            },
            YELLOW: {
                SIZE: 282,
                COLOR: '#d6c66d',
                CORNERS: {
                    DIAMETER: 57,
                    OFFSET: 40
                }
            }
        }
    },
} as const