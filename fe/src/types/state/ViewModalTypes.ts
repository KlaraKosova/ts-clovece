export const ViewModalTypes = {
    NO_MOVES_MODAL: 'NO_MOVES_MODAL',
    HOME_MOVES_ONLY_MODAL: 'HOME_MOVES_ONLY_MODAL',
    GAME_OVER_MODAL: 'GAME_OVER_MODAL',
    CURRENT_PLAYER_MODAL: 'CURRENT_PLAYER_MODAL'
} as const

export type ViewModalTypes = typeof ViewModalTypes[keyof typeof ViewModalTypes]
