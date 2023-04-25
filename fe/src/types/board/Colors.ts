export const Colors = {
    RED: 'RED',
    YELLOW: 'YELLOW',
    GREEN: 'GREEN',
    BLUE: 'BLUE',
} as const

export type Colors = typeof Colors[keyof typeof Colors]