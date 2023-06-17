export const ModalEventTypes = {
    SHOW_NO_MOVES_MODAL: 'SHOW_NO_MOVES_MODAL',
    SHOW_HOME_MOVES_ONLY_MODAL: 'SHOW_HOME_MOVES_ONLY_MODAL',
    SHOW_GAME_OVER_MODAL: 'SHOW_GAME_OVER_MODAL',
    SHOW_CURRENT_PLAYER_MODAL: 'SHOW_CURRENT_PLAYER_MODAL',
    CLEAR_ALL: 'CLEAR_ALL'
} as const

// disable eslint for enums and their types
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ModalEventTypes = typeof ModalEventTypes[keyof typeof ModalEventTypes]
