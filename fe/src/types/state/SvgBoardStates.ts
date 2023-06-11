export const SvgBoardStates = {
    LOADING: 'LOADING',
    DICE: 'DICE',// vychozi stav kostky pred animaci
    DICE_ANIMATION: 'DICE_ANIMATION',// animace kostky
    DICE_PLAY_BUTTON: 'DICE_PLAY_BUTTON',// zobrazeni play btn
    NO_MOVES: 'NO_MOVES', // zobrazeni modalu
    HOME_MOVES_ONLY: 'HOME_MOVES_ONLY',
    HIGHLIGHT_ANIMATION: 'HIGHLIGHT_ANIMATION', // highlight moznych tahu
    CURRENT_PLAYER_FIGURE_MOVE_ANIMATION: 'CURRENT_PLAYER_FIGURE_MOVE_ANIMATION', // animace po kliknuti na pole/figurku
    NEXT_PLAYER_FIGURE_MOVE_ANIMATION: 'NEXT_PLAYER_FIGURE_MOVE_ANIMATION', // animace tahu ostatnich hracu
    WAITING: 'WAITING', // prechodny stav
    WINNER_MODAL: 'WINNER_MODAL' // konec hry a zobrazeni modalu
} as const

export type SvgBoardStates = typeof SvgBoardStates[keyof typeof SvgBoardStates]