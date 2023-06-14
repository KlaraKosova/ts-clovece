import { SVG } from "@svgdotjs/svg.js";
import Consts from "../utils/svgBoardConstants";
import { SocketIOClientInstance } from "../socketio/SocketClient";
import { View } from "./View";
import App from "../App";
import { DocumentClickData } from "../types/state/DocumentClickData";
import { PlayerColors, PlayersOrder } from "../types/common/PlayerColors";
import { GameProgressDataset } from "../types/data/GameProgressDataset";
import { GameProgressUpdate } from "../types/data/GameProgressUpdate";
import { State } from "../gameProgressControls/State";
import { ViewModalTypes } from "@/types/state/ViewModalTypes";
import {ModalEventBusInstance} from "@/gameProgressControls/modals/ModalEventBus";
import {ModalEventTypes} from "@/types/state/ModalEventBusEventTypes";
import { createElement } from "@/utils/domHelpers";
import { ViewModalState } from "@/types/state/ViewModalState";
import { cloneDeep, create } from "lodash";
import { modals } from "@/utils/modals";
import { PlayerColorNameMap } from "@/utils/constants";

export class GameProgressView extends View {
    private state: State

    public render(): void {
        const wrapper = document.createElement("div")
        wrapper.classList.add("game-progress-wrapper")
        const headerBar = document.createElement("div")
        const modalsContainer = document.createElement("div")
        modalsContainer.id = "modalsContainer"
        const container = document.createElement("div")
        container.id = "svgContainer";

        wrapper.replaceChildren(headerBar, container, modalsContainer)
        this.rootElem.replaceChildren(wrapper)
        const color = App.getUserInfo().color
        document.body.style.backgroundColor = Consts.COLORS[color].FIGURE_HIGHLIGHT

        const draw = SVG().addTo("#svgContainer").size(Consts.BOARD.SIZE * Consts.K, Consts.BOARD.SIZE * Consts.K)
        this.state = new State(draw, App.getUserInfo())
        this.state.renderInitial()
    }

    private onGameProgressResponse(game: GameProgressDataset) {
        console.log('onGameProgressResponse', game)
        this.state.handleGameProgressResponse(game)

        const winnerColor = this.state.getWinnerColor()
        if (winnerColor !== null) {
            this.setGameOverHeaderBar(winnerColor)
        } else {
            const currentPlayerColor = this.state.getCurrentColor()
            ModalEventBusInstance.publish(ModalEventTypes.CLEAR_ALL)
            ModalEventBusInstance.publish(ModalEventTypes.SHOW_CURRENT_PLAYER_MODAL, { currentPlayerColor })
        }
    }

    private async onGameProgressUpdate(data: { progress: GameProgressDataset, updates: GameProgressUpdate[] }) {
        console.log('onGameProgressUpdate', data)
        await this.state.handleGameProgressUpdate(data)

        const currentPlayerColor = this.state.getCurrentColor()
        ModalEventBusInstance.publish(ModalEventTypes.CLEAR_ALL)
        ModalEventBusInstance.publish(ModalEventTypes.SHOW_CURRENT_PLAYER_MODAL, { currentPlayerColor })
    }

    private async onGameWinner(data: { winnerId: string }) {
        console.log('onGameWinner', data)
        this.state.handleGameWinnerUpdate(data)
    }

    private async onDocumentClick(event: PointerEvent) {
        const result: DocumentClickData = {
            field: null,
            figure: null,
            dice: false,
            playButton: false,
            nextPlayerButton: false
        }
        for (let i = 0; i < event.composedPath().length; i++) {
            const element = event.composedPath()[i]
            if (element instanceof HTMLElement || element instanceof SVGElement) {
                const dataset = element.dataset
                result.dice = result.dice || !!dataset.dice
                result.playButton = result.playButton || !!dataset.playButton
                result.nextPlayerButton = result.nextPlayerButton || !!dataset.nextPlayerButton

                if (element.classList.contains('field')
                    && dataset.index
                    && dataset.isHome
                    && dataset.isStart
                ) { // dataset.color is optional
                    result.field = {
                        index: +dataset.index,
                        isHome: dataset.isHome === 'true',
                        isStart: dataset.isStart === 'true',
                        color: dataset.color as PlayerColors || null
                    }
                }

                if (element.classList.contains('figure')
                    && dataset.color
                    && dataset.index
                ) {
                    result.figure = {
                        index: +dataset.index,
                        color: dataset.color as PlayerColors
                    }
                }
            }
        }
       this.state.handleDocumentClick(result)
    }

    protected registerSocketListeners(): void {
        SocketIOClientInstance.socket.on("GAME_PROGRESS_RESPONSE", this.onGameProgressResponse.bind(this))
        SocketIOClientInstance.socket.on("GAME_PROGRESS_UPDATE", this.onGameProgressUpdate.bind(this))
        SocketIOClientInstance.socket.on("GAME_WINNER", this.onGameWinner.bind(this))
    }

    protected removeSocketListeners(): void {
        SocketIOClientInstance.socket.off("GAME_PROGRESS_RESPONSE")
        SocketIOClientInstance.socket.off("GAME_PROGRESS_UPDATE")
    }

    protected registerHtmlListeners() {
        super.registerHtmlListeners();
        document.addEventListener('click', this.onDocumentClick.bind(this))
    }

    protected removeHtmlListeners() {
        super.removeHtmlListeners();
        document.removeEventListener('click', this.onDocumentClick)
    }

    public mount(): void {
        super.mount()
        console.log('emit GAME_PROGRESS_REQUEST');

        SocketIOClientInstance.socket.emit("GAME_PROGRESS_REQUEST")
        
        Object.keys(ModalEventTypes).forEach((eventType: ModalEventTypes) => {
            ModalEventBusInstance.subscribe(eventType, (data: any) => this.handleModalEvent.call(this, eventType, data))        
        })
    }

    private setGameOverHeaderBar(color: PlayerColors) {
        const headerBar = this.rootElem.querySelector('.game-progress-wrapper :first-child') as HTMLElement

        headerBar.style.backgroundColor = Consts.COLORS[color].FIGURE_BODY
        headerBar.textContent = "Game over. <TODO> won"
    }


    private handleModalEvent(event: ModalEventTypes, data: any) {
        console.log('handle');
        console.log(event);
        console.log(data);
        
        if (event === ModalEventTypes.CLEAR_ALL) {
            const modalsContainer = document.getElementById("modalsContainer")!
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

    private createModalData(modalType: ViewModalTypes, eventData: any) {
        const modalData = cloneDeep(modals[modalType])

        if (eventData === undefined) {
            return modalData
        }

        if (modalType === ViewModalTypes.CURRENT_PLAYER_MODAL) {
            const data = eventData as {
                currentPlayerColor: PlayerColors
            } 

            if (data.currentPlayerColor === App.getUserInfo().color) {
                modalData.headerList[0].content = "Jste na tahu"
            } else {
                modalData.headerList[0].content = PlayerColorNameMap[data.currentPlayerColor] + " hraje"
            }
            modalData.wrapperClasslist.push(`side-modal-current-player__${data.currentPlayerColor}`)
        
        }

        // TODO
        return modalData
    }

    private renderModal(modal: ViewModalState) {
        console.log(modal);
        
        const modalsContainer = document.getElementById("modalsContainer")!

        const modalWrapper = createElement<HTMLDivElement>('div', ['side-modal', ...modal.wrapperClasslist], '')
        modalWrapper.id = modal.id
        const modalInner = createElement<HTMLDivElement>('div', ['side-modal-inner'], '')
        const modalHeader = createElement<HTMLDivElement>('div', ['side-modal-header'], '')
        const modalContent = createElement<HTMLDivElement>('div', ['side-modal-content'], '')
        
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
        modalWrapper.appendChild(modalInner)

        modalsContainer.appendChild(modalWrapper)
    }
}
