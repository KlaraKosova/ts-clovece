export const SvgBoardStates = {
    LOADING: 'LOADING',
    DICE: 'DICE',// vychozi stav kostky pred animaci
    DICE_ANIMATION: 'DICE_ANIMATION',// animace kostky
    DICE_PLAY_BUTTON: 'DICE_PLAY_BUTTON',// zobrazeni play btn
    NO_MOVES_MODAL: 'NO_MOVES_MODAL', // zobrazeni modalu
    HIGHLIGHT_ANIMATION: 'HIGHLIGHT_ANIMATION', // highlight moznych tahu
    CURRENT_PLAYER_FIGURE_MOVE_ANIMATION: 'CURRENT_PLAYER_FIGURE_MOVE_ANIMATION', // animace po kliknuti na pole/figurku
    NEXT_PLAYER_FIGURE_MOVE_ANIMATION: 'NEXT_PLAYER_FIGURE_MOVE_ANIMATION', // animace tahu ostatnich hracu
    HOME_MOVES_ONLY_MODAL: 'HOME_MOVES_ONLY_MODAL', // zobrazeni modalu o dostupnych tazich jen v "domecku"
    WAITING: 'WAITING' // prechodny stav
} as const

export type SvgBoardStates = typeof SvgBoardStates[keyof typeof SvgBoardStates]