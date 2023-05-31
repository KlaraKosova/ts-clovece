export const SvgElementLayers = {
    BACKGROUND: 'BACKGROUND',
    FIELDS: 'FIELDS',
    FIGURES: 'FIGURES',
    OVERLAY: 'OVERLAY',
    MODALS: 'MODALS'
} as const

export type SvgElementLayers = typeof SvgElementLayers[keyof typeof SvgElementLayers]