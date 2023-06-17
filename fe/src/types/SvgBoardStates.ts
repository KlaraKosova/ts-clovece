export const SvgBoardStates = {
    LOADING: 'LOADING', // loading animation, initial state
    DICE: 'DICE', // initial state before dice animation sequence
    DICE_ANIMATION: 'DICE_ANIMATION', // dice animation sequence state
    DICE_PLAY_BUTTON: 'DICE_PLAY_BUTTON', // show DicePlayButton element
    NO_MOVES: 'NO_MOVES', // no available moves, show modal
    HOME_MOVES_ONLY: 'HOME_MOVES_ONLY', // available moves only for figures "at home", show modal
    HIGHLIGHT_ANIMATION: 'HIGHLIGHT_ANIMATION', // highlight available moves state
    CURRENT_PLAYER_FIGURE_MOVE_ANIMATION: 'CURRENT_PLAYER_FIGURE_MOVE_ANIMATION', // animation after highlighted figure/field click
    NEXT_PLAYER_FIGURE_MOVE_ANIMATION: 'NEXT_PLAYER_FIGURE_MOVE_ANIMATION', // animation of another player's turn
    WAITING: 'WAITING', // transitional state
    WINNER_MODAL: 'WINNER_MODAL' // game over, show modal
} as const

// disable eslint for enums and their types
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SvgBoardStates = typeof SvgBoardStates[keyof typeof SvgBoardStates]
