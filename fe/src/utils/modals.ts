import { type ViewModalState } from '@/types/ViewModalState'
import { ViewModalTypes } from '@/types/ViewModalTypes'
import { locale } from './locale'

export const modals: Record<ViewModalTypes, ViewModalState> = {
    [ViewModalTypes.NO_MOVES_MODAL]: {
        headerList: [
            {
                tag: 'h6',
                content: locale.get('noMovesHeader'),
                classList: ['sidemodal-header__text']
            }
        ],
        contentList: [
            {
                tag: 'div',
                content: locale.get('noMovesDescription'),
                classList: []
            },
            {
                tag: 'button',
                content: locale.get('nextPlayer'),
                classList: ['btn', 'btn-success', 'btn-nextplayer'],
                dataset: { nextPlayerButton: 'true' }
            }
        ],
        containerClasslist: ['sidemodal-danger'],
        id: 'noMovesModal'
    },
    [ViewModalTypes.HOME_MOVES_ONLY_MODAL]: {
        headerList: [
            {
                tag: 'h6',
                content: locale.get('homeMovesOnlyHeader'),
                classList: ['sidemodal-header__text']
            }
        ],
        contentList: [
            {
                tag: 'div',
                content: locale.get('homeMovesOnlyDescription'),
                classList: []
            },
            {
                tag: 'button',
                content: locale.get('nextPlayer'),
                classList: ['btn', 'btn-success', 'btn-nextplayer'],
                dataset: { nextPlayerButton: 'true' }
            }
        ],
        containerClasslist: [],
        id: 'homeMovesOnlyModal'
    },
    [ViewModalTypes.GAME_OVER_MODAL]: {
        headerList: [
            {
                tag: 'span',
                content: '',
                classList: ['sidemodal-header__icon-left']
            },
            {
                tag: 'h6',
                content: '',
                classList: ['sidemodal-header__text']
            }
        ],
        contentList: [
            {
                tag: 'div',
                content: locale.get('gameOver'),
                classList: []
            },
            {
                tag: 'button',
                content: locale.get('newGame'),
                classList: ['btn', 'btn-success', 'btn-full']
            }
        ],
        containerClasslist: [],
        id: 'gameOverModal'
    },

    [ViewModalTypes.CURRENT_PLAYER_MODAL]: {
        headerList: [
            {
                tag: 'h6',
                content: '',
                classList: ['sidemodal-header__text']
            }
        ],
        contentList: [],
        containerClasslist: [],
        id: 'currentPlayerModal'
    }
}
