import { SVG } from "@svgdotjs/svg.js";
import { BoardController } from "../BoardController";
import Consts from "../helpers/svgBoardConstants";
import { SocketIOClientInstance } from "../socketio/SocketClient";
import { GameProgress } from "../types";
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

    private onDocumentClick(event: PointerEvent) {
        const result = {
            // @ts-ignore
            field: null,
            // @ts-ignore
            figure: null,
            dice: false
        }
        for (let i = 0; i < event.composedPath().length; i++) {
            const element = event.composedPath()[i]
            if (element instanceof Element) {
                console.log(element)
                switch (element.id) {
                    case "svg_dice": result.dice = true
                }
            }
        }
        console.log(event)
        console.log(result)
    }

    protected registerSocketListeners(): void {
        SocketIOClientInstance.socket.on("GAME_PROGRESS_RESPONSE", this.onGameProgressResponse.bind(this))
    }

    protected removeSocketListeners(): void {
        SocketIOClientInstance.socket.off("GAME_PROGRESS_RESPONSE")
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
