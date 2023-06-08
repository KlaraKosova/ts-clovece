export const SvgElements = {
    STATIC_BACKGROUND: 'STATIC_BACKGROUND',
    MAIN_FIELDS: 'MAIN_FIELDS',
    START_FIELDS: 'START_FIELDS',
    HOME_FIELDS: 'HOME_FIELDS',
    FIGURES: 'FIGURES',
    OVERLAY: 'OVERLAY',
    DICE: 'DICE',
    DICE_PLAY_BUTTON: 'DICE_PLAY_BUTTON',
    LOADING: 'LOADING',
} as const

export type SvgElements = typeof SvgElements[keyof typeof SvgElements]
