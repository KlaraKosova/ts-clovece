export const LayerNames = {
    BACKGROUND: 'BACKGROUND',
    FIELDS: 'FIELDS',
    FIGURES_RED: 'FIGURES_RED',
    FIGURES_YELLOW: 'FIGURES_YELLOW',
    FIGURES_GREEN: 'FIGURES_GREEN',
    FIGURES_BLUE: 'FIGURES_BLUE',
    OVERLAY: 'OVERLAY',
    DICE_BUTTONS_MODALS: 'DICE_BUTTONS_MODALS'
} as const

// disable eslint for enums and their types
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LayerNames = typeof LayerNames[keyof typeof LayerNames]
