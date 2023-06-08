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
import { ViewModalState } from "@/types/state/ViewModalState";
import { ViewModalTypes } from "@/types/state/ViewModalTypes";
import {ModalEventBusInstance} from "@/gameProgressControls/modals/ModalEventBus";
import {ModalEventTypes} from "@/types/state/ModalEventBusEventTypes";
import { createElement } from "@/utils/domHelpers";

export class GameProgressView extends View {
    private state: State
    private displayModals = true
    private modals: ViewModalState[] = []

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
        this.setHeaderBarColor(game)
    }

    private async onGameProgressUpdate(data: { progress: GameProgressDataset, updates: GameProgressUpdate[] }) {
        console.log('onGameProgressUpdate', data)
        this.setHeaderBarColor(data.progress)
        this.state.handleGameProgressUpdate(data)
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
        ModalEventBusInstance.subscribe(ModalEventTypes.SHOW_NO_MOVES_MODAL, this.modalEventBusHandlers_showNoMovesModal.bind(this))
        ModalEventBusInstance.subscribe(ModalEventTypes.CLEAR_ALL_MODALS, this.modalEventBusHandlers_clearAllModals.bind(this))
    }

    private setHeaderBarColor(progress: GameProgressDataset) {
        const headerBar = this.rootElem.querySelector('.game-progress-wrapper :first-child') as HTMLElement
        PlayersOrder.forEach(color => {
            if (progress.playerStatuses[color].userId === progress.currentPlayerId) {
                headerBar.style.backgroundColor = Consts.COLORS[color].FIGURE_BODY
            }
            if (progress.currentPlayerId === App.getUserInfo().userId) {
                headerBar.textContent = "Jste na tahu"
            } else {
                headerBar.textContent = "Jiny hrac"
            }

        })
    }

    private modalEventBusHandlers_showNoMovesModal() {
        const modalWrapper = createElement<HTMLDivElement>('div', ['side-modal', 'side-modal-danger'], '')
        const modalInner = createElement<HTMLDivElement>('div', ['side-modal-inner'], '')
        const title = createElement<HTMLHeadingElement>('h6', ['side-modal-header'], 'Zadne dalsi tahy')

        const modalContent = createElement<HTMLDivElement>('div', ['side-modal-content'], '')
        const nextPlayerButton = createElement<HTMLButtonElement>('button',
            ['btn', 'btn-success', 'next-player-btn'],
            'Dalsi hrac',
            { nextPlayerButton: 'true' }
        )

        modalContent.append(nextPlayerButton)
        modalInner.append(title, modalContent)


        modalWrapper.appendChild(modalInner)

        const modalsContainer = document.getElementById("modalsContainer")!
        modalsContainer.append(modalWrapper)
    }


    private modalEventBusHandlers_clearAllModals() {
        const modalsContainer = document.getElementById("modalsContainer")!
        modalsContainer.replaceChildren()
    }
}
