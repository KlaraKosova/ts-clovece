import { Svg } from "@svgdotjs/svg.js";
import { GameLogicController } from "./gameLogicLayer/GameLogicController";
import { SvgStateController } from "./svgLayer/SvgStateController";
import { SvgBoardStates } from "./types/state/SvgBoardStates";
import { GameProgressDataset } from "./types/data/GameProgressDataset";

export class State {
    private boardState: SvgBoardStates;
    private svgController: SvgStateController
    private gameLogicController: GameLogicController

    constructor(draw: Svg) {
        this.boardState = SvgBoardStates.LOADING

        this.svgController = new SvgStateController(draw)
        this.gameLogicController = new GameLogicController()
    }

    public init() {
        this.svgController.renderInitial()
    }

    public initLoaded(dataset: GameProgressDataset) {
        this.gameLogicController.setDataset(dataset)


    }
    
}