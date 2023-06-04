import {Svg} from "@svgdotjs/svg.js";
import {SvgLayer} from "@/gameProgressControls/SvgLayer";
import {SvgBoardStates} from "@/types/state/SvgBoardStates";
import {LogicLayer} from "@/gameProgressControls/LogicLayer";
import { GameProgressDataset } from "@/types/data/GameProgressDataset";
import {UserInfo} from "@/types/common/UserInfo";

export class State {
    private boardState: SvgBoardStates;
    private svg: SvgLayer
    private logic: LogicLayer
    private user: UserInfo

    constructor(draw: Svg, user: UserInfo) {
        this.boardState = SvgBoardStates.LOADING

        this.svg = new SvgLayer(draw)
        this.logic = new LogicLayer()
        this.user = user
    }

    public renderInitial() {
        this.svg.renderInitial()
    }

    public initLoaded(dataset: GameProgressDataset) {
        this.gameLogicController.setDataset(dataset)


    }
}