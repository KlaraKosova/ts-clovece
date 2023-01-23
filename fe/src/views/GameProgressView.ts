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
        this.boardController.init()
    }

    private onGameProgressResponse(game: GameProgress) {
        console.log(game);
        this.boardController.setGameProgress(game)
        this.boardController.render()
    }

    protected registerSocketListeners(): void {
        SocketIOClientInstance.socket.on("GAME_PROGRESS_RESPONSE", this.onGameProgressResponse.bind(this))   
    }

    protected removeSocketListeners(): void {
        SocketIOClientInstance.socket.off("GAME_PROGRESS_RESPONSE")
    }

    public mount(): void {
        super.mount()
        SocketIOClientInstance.socket.emit("GAME_PROGRESS_REQUEST")
    }
}
