import { SVG } from "@svgdotjs/svg.js";
import { BoardController } from "../BoardController";
import Consts from "../helpers/svgBoardConstants";
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
    public viewInit(): void {

    }
    public registerHtmlListeners(): void {

    }
    public registerSocketListeners(): void {

    }
    public removeHtmlListeners(): void {

    }
    public removeSocketListeners(): void {

    }
}
