export const ViewModalTypes = {
    NO_MOVES_MODAL: 'NO_MOVES_MODAL'
} as const

export type ViewModalTypes = typeof ViewModalTypes[keyof typeof ViewModalTypes]
