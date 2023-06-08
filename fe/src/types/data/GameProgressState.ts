export const GameProgressStates = {
    LOADING: 'LOADING',
    DICE: 'DICE',// vychozi stav kostky pred animaci
    DICE_ANIMATION: 'DICE_ANIMATION',// animace kostky
    DICE_PLAY_BUTTON: 'DICE_PLAY_BUTTON',// zobrazeni play btn
    NO_MOVES: 'NO_MOVES', // zobrazeni modalu s hlaskou 'zadne dalsi tahy'
    HIGHLIGHT_ANIMATION: 'HIGHLIGHT_ANIMATION', // highlight moznych tahu
    CURRENT_PLAYER_FIGURE_MOVE_ANIMATION: 'CURRENT_PLAYER_FIGURE_MOVE_ANIMATION', // animace po kliknuti na pole/figurku
    NEXT_PLAYER_FIGURE_MOVE_ANIMATION: 'NEXT_PLAYER_FIGURE_MOVE_ANIMATION', // animace tahu ostatnich hracu
    WAITING: 'WAITING' // prechodny stav
} as const

export type GameProgressStates = typeof GameProgressStates[keyof typeof GameProgressStates]