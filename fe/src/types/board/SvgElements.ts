export const SvgElements = {
    BACKGROUND: 'BACKGROUND',
    MAIN_FIELDS: 'MAIN_FIELDS',
    START_FIELDS: 'START_FIELDS',
    HOME_FIELDS: 'HOME_FIELDS',
    FIGURES: 'FIGURES',
    OVERLAY: 'OVERLAY',
    DICE: 'DICE',
    DICE_PLAY_BUTTON: 'DICE_PLAY_BUTTON',
    NO_MOVES_MODAL: 'NO_MOVES_MODAL',
    NEXT_PLAYER_BUTTON: 'NEXT_PLAYER_BUTTON',
    LOADING: 'LOADING'
} as const

export type SvgElements = typeof SvgElements[keyof typeof SvgElements]
