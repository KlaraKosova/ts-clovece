import { SVG } from "@svgdotjs/svg.js";
import { BoardController } from "../BoardController";
import Consts from "../helpers/svgBoardConstants";
import { SocketIOClientInstance } from "../socketio/SocketClient";
import {GameProgress, DocumentClickData, PlayerColor, GameProgressUpdate} from "../types";
import { View } from "./View";

export class GameProgressView extends View {
    private boardController: BoardController

    public render(): void {
        const container = document.createElement("div");
        container.id = "svgContainer";
        this.rootElem.replaceChildren(container);

        const draw = SVG().addTo("#svgContainer").size(Consts.BOARD.SIZE * Consts.K, Consts.BOARD.SIZE * Consts.K);
        this.boardController = new BoardController(draw)
        this.boardController.render()
    }

    private onGameProgressResponse(game: GameProgress) {
        this.boardController.updateGameProgress(game)
    }

    private async onGameProgressUpdate(data: {progress: GameProgress, updates: GameProgressUpdate[]}) {
        this.boardController.setProgress(data.progress)
        await this.boardController.animateUpdates(data.updates)
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
                        color: dataset.color as PlayerColor || null
                    }
                }

                if (element.classList.contains('figure')
                    && dataset.color
                    && dataset.index
                ) {
                    result.figure = {
                        index: +dataset.index,
                        color: dataset.color as PlayerColor
                    }
                }
            }
        }
        await this.boardController.handleClick(result)
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
        SocketIOClientInstance.socket.emit("GAME_PROGRESS_REQUEST")
    }
}
