export const ViewNames = {
    LOADING: 'LOADING',
    GAME_PROGRESS: 'GAME_PROGRESS',
    GAME_SELECT: 'GAME_SELECT',
    GAME_WAITING: 'GAME_WAITING'
} as const

// disable eslint for enums and their types
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ViewNames = typeof ViewNames[keyof typeof ViewNames]
