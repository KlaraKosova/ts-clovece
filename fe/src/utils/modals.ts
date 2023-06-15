import { ViewModalState } from "@/types/state/ViewModalState";
import { ViewModalTypes } from "@/types/state/ViewModalTypes";

export const modals:  Record<ViewModalTypes, ViewModalState> = {
    [ViewModalTypes.NO_MOVES_MODAL]: {
        headerList: [
            {
                tag: 'h6',
                content: 'Zadne dalsi tahy',
                classList: ['sidemodal-header__text']
            }
        ],
        contentList: [
            {
                tag: 'div',
                content: 'Nejsou dostupne zadne dalsi tahy',
                classList: []
            },
            {
                tag: 'button',
                content: 'Dalsi hrac',
                classList:['btn', 'btn-success', 'btn-nextplayer'],
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
                content: 'Omezene dostupne tahy',
                classList: ['sidemodal-header__text']
            }
        ],
        contentList: [
            {
                tag: 'div',
                content: 'Dostupne tahy pouze pro figurky "v domecku". Preskocit kolo?',
                classList: []
            },
            {
                tag: 'button',
                content: 'Dalsi hrac',
                classList:['btn', 'btn-success', 'btn-nextplayer'],
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
                content: 'Konec hry',
                classList: []
            },
            {
                tag: 'button',
                content: 'Nová hra',
                classList: ['btn', 'btn-success', 'btn-full']
            },
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