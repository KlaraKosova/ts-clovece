export const ModalEventTypes = {
    SHOW_NO_MOVES_MODAL: 'SHOW_NO_MOVES_MODAL',
    CLEAR_ALL_SIDE_MODALS: 'CLEAR_ALL_SIDE_MODALS',
    SHOW_HOME_MOVES_ONLY_MODAL: 'SHOW_HOME_MOVES_ONLY_MODAL'
} as const

export type ModalEventTypes = typeof ModalEventTypes[keyof typeof ModalEventTypes]
