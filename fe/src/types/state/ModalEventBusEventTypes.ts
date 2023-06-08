export const ModalEventTypes = {
    SHOW_NO_MOVES_MODAL: 'NO_MOVES_MODAL',
    CLEAR_ALL_MODALS: 'CLEAR_ALL_MODALS'
} as const

export type ModalEventTypes = typeof ModalEventTypes[keyof typeof ModalEventTypes]
