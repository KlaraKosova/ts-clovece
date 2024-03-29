import { SVG } from '@svgdotjs/svg.js'
import Consts from '../utils/svgBoardConstants'
import { SocketIOClientInstance } from '../socketio/SocketClient'
import { View } from './View'
import App from '../App'
import { type DocumentClickData } from '../types/DocumentClickData'
import { type PlayerColors } from '../types/PlayerColors'
import { type GameProgressDTO } from '../types/dtos/GameProgressDTO'
import { type GameProgressUpdateDTO } from '../types/dtos/GameProgressUpdateDTO'
import { StateControl } from '../controls/StateControl'
import { ViewModalTypes } from '@/types/ViewModalTypes'
import { ModalEventBusInstance } from '@/controls/modals/ModalEventBus'
import { ModalEventTypes } from '@/types/ModalEventBusEventTypes'
import { createElement } from '@/utils/domHelpers'
import { type ViewModalState } from '@/types/ViewModalState'
import { cloneDeep } from 'lodash'
import { modals } from '@/utils/modals'
import { PlayerColorNameMap } from '@/utils/constants'
import { locale } from '@/utils/locale'

export class GameProgressView extends View {
    private state: StateControl

    public render(): void {
        const mainContainer = createElement('div', ['game-progress-container'])
        const modalsContainer = createElement('div', [])
        modalsContainer.id = 'modalsContainer'
        const svgContainer = createElement('div', [])
        svgContainer.id = 'svgContainer'

        mainContainer.replaceChildren(svgContainer, modalsContainer)
        this.rootElem.replaceChildren(mainContainer)
        const color = App.getUserInfo().color
        document.body.style.backgroundColor = Consts.COLORS[color].FIGURE_HIGHLIGHT

        const draw = SVG().addTo('#svgContainer').size(Consts.BOARD.SIZE.X * Consts.K, Consts.BOARD.SIZE.Y * Consts.K)
        this.state = new StateControl(draw, App.getUserInfo())
        this.state.renderInitial()
    }

    private async onGameProgressResponse(game: GameProgressDTO): Promise<void> {
        console.log('onGameProgressResponse', game)
        await this.state.handleGameProgressResponse(game)
    }

    private async onGameProgressUpdate(data: { progress: GameProgressDTO, updates: GameProgressUpdateDTO[] }): Promise<void> {
        console.log('onGameProgressUpdate', data)
        await this.state.handleGameProgressUpdate(data)

        const currentPlayerColor = this.state.getCurrentColor()
        ModalEventBusInstance.publish(ModalEventTypes.CLEAR_ALL)
        ModalEventBusInstance.publish(ModalEventTypes.SHOW_CURRENT_PLAYER_MODAL, { currentPlayerColor })
    }

    private async onGameWinner(data: { winnerId: string }): Promise<void> {
        console.log('onGameWinner', data)
        await this.state.handleGameWinnerUpdate(data)
    }

    private async onDocumentClick(event: PointerEvent): Promise<void> {
        const result: DocumentClickData = {
            field: null,
            figure: null,
            dice: false,
            playButton: false,
            nextPlayerButton: false,
            nextGameButton: false
        }
        for (let i = 0; i < event.composedPath().length; i++) {
            const element = event.composedPath()[i]
            if (element instanceof HTMLElement || element instanceof SVGElement) {
                const dataset = element.dataset
                result.dice = result.dice || !!dataset.dice
                result.playButton = result.playButton || !!dataset.playButton
                result.nextPlayerButton = result.nextPlayerButton || !!dataset.nextPlayerButton
                result.nextGameButton = result.nextGameButton || !!dataset.nextGameButton

                if (element.classList.contains('field') &&
                    dataset.index &&
                    dataset.isHome &&
                    dataset.isStart
                ) { // dataset.color is optional
                    result.field = {
                        index: +dataset.index,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
                        // @ts-ignore
                        isHome: dataset.isHome === 'true',
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
                        // @ts-ignore
                        isStart: dataset.isStart === 'true',
                        color: dataset.color as PlayerColors || null
                    }
                }

                if (element.classList.contains('figure') &&
                    dataset.color &&
                    dataset.index
                ) {
                    result.figure = {
                        index: +dataset.index,
                        color: dataset.color as PlayerColors
                    }
                }
            }
        }
        await this.state.handleDocumentClick(result)
    }

    protected registerSocketListeners(): void {
        SocketIOClientInstance.socket.on('GAME_PROGRESS_RESPONSE', this.onGameProgressResponse.bind(this))
        SocketIOClientInstance.socket.on('GAME_PROGRESS_UPDATE', this.onGameProgressUpdate.bind(this))
        SocketIOClientInstance.socket.on('GAME_WINNER', this.onGameWinner.bind(this))
    }

    protected removeSocketListeners(): void {
        SocketIOClientInstance.socket.off('GAME_PROGRESS_RESPONSE')
        SocketIOClientInstance.socket.off('GAME_PROGRESS_UPDATE')
    }

    protected registerHtmlListeners(): void {
        super.registerHtmlListeners()
        document.addEventListener('click', this.onDocumentClick.bind(this))
    }

    protected removeHtmlListeners(): void {
        super.removeHtmlListeners()
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        document.removeEventListener('click', this.onDocumentClick)
    }

    public mount(): void {
        super.mount()
        // this.rootElem.
        console.log('emit GAME_PROGRESS_REQUEST')

        SocketIOClientInstance.socket.emit('GAME_PROGRESS_REQUEST')

        Object.keys(ModalEventTypes).forEach((eventType: ModalEventTypes) => {
            ModalEventBusInstance.subscribe(eventType, (data: any) => {
                this.handleModalEvent(eventType, data)
            })
        })
    }

    private handleModalEvent(event: ModalEventTypes, data: any): void {
        console.log('handle')
        console.log(event)
        console.log(data)

        if (event === ModalEventTypes.CLEAR_ALL) {
            // modalsContainer should always exist
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const modalsContainer = document.getElementById('modalsContainer')!
            modalsContainer.replaceChildren()
            return
        }

        let modalType = null as null | ViewModalTypes

        if (event === ModalEventTypes.SHOW_NO_MOVES_MODAL) {
            modalType = ViewModalTypes.NO_MOVES_MODAL
        } else if (event === ModalEventTypes.SHOW_HOME_MOVES_ONLY_MODAL) {
            modalType = ViewModalTypes.HOME_MOVES_ONLY_MODAL
        } else if (event === ModalEventTypes.SHOW_GAME_OVER_MODAL) {
            modalType = ViewModalTypes.GAME_OVER_MODAL
        } else if (event === ModalEventTypes.SHOW_CURRENT_PLAYER_MODAL) {
            modalType = ViewModalTypes.CURRENT_PLAYER_MODAL
        }

        if (modalType !== null) {
            const modalState = this.createModalData(modalType, data)
            this.renderModal(modalState)
        }
    }

    private createModalData(modalType: ViewModalTypes, eventData: any): ViewModalState {
        const modalData = cloneDeep(modals[modalType])

        if (eventData === undefined) {
            return modalData
        }

        if (modalType === ViewModalTypes.CURRENT_PLAYER_MODAL) {
            const data = eventData as {
                currentPlayerColor: PlayerColors
            }

            if (data.currentPlayerColor === App.getUserInfo().color) {
                modalData.headerList[0].content = locale.get('yourTurn')
            } else {
                modalData.headerList[0].content = PlayerColorNameMap[data.currentPlayerColor] + locale.get('otherPlayerTurnSuffix')
            }
            modalData.containerClasslist.push(`sidemodal-current-player__${data.currentPlayerColor}`)
        }

        if (modalType === ViewModalTypes.GAME_OVER_MODAL) {
            const data = eventData as {
                winnerColor: PlayerColors
            }

            if (App.getUserInfo().color === data.winnerColor) {
                modalData.headerList[0].content = '☺'
                modalData.headerList[1].content = locale.get('youWon')
                modalData.containerClasslist.push('sidemodal-success')
            } else {
                modalData.headerList[0].content = '☹'
                modalData.headerList[1].content = PlayerColorNameMap[data.winnerColor] + locale.get('otherPlayerWonSuffix')
                modalData.containerClasslist.push('sidemodal-danger')
            }
        }
        return modalData
    }

    private renderModal(modal: ViewModalState): void {
        console.log(modal)
        // modalsContainer should always exist
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const modalsContainer = document.getElementById('modalsContainer')!

        const modalContainer = createElement<HTMLDivElement>('div', ['sidemodal', ...modal.containerClasslist], '')
        modalContainer.id = modal.id
        const modalInner = createElement<HTMLDivElement>('div', ['sidemodal-inner'], '')
        const modalHeader = createElement<HTMLDivElement>('div', ['sidemodal-header'], '')
        const modalContent = createElement<HTMLDivElement>('div', ['sidemodal-content'], '')

        const modalHeaderElements = [] as HTMLElement[]
        const modalContentElements = [] as HTMLElement[]

        modal.headerList.forEach((e) => {
            const element = createElement(e.tag, [...e.classList], e.content, e.dataset)
            modalHeaderElements.push(element)
        })

        modal.contentList.forEach((e) => {
            const element = createElement(e.tag, [...e.classList], e.content, e.dataset)
            modalContentElements.push(element)
        })

        modalHeader.replaceChildren(...modalHeaderElements)
        modalContent.replaceChildren(...modalContentElements)

        modalInner.append(modalHeader, modalContent)
        modalContainer.appendChild(modalInner)

        modalsContainer.appendChild(modalContainer)
    }
}
