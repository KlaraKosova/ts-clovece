import { Svg } from "@svgdotjs/svg.js";
import { LogicLayer } from "./LogicLayer";
import { SvgLayer } from "./SvgLayer";
import { GameProgressDataset } from "../types/data/GameProgressDataset";
import { SvgBoardStates } from "../types/board/SvgBoardStates";
import { UserInfo } from "../types/common/UserInfo";
import { cloneDeep } from "lodash";
import { DocumentClickData } from "../types/board/DocumentClickData";

export class State {
    private logic: LogicLayer
    private svg: SvgLayer
    private boardState: SvgBoardStates;

    private user: UserInfo

    constructor(draw: Svg, user: UserInfo) {
        this.boardState = SvgBoardStates.LOADING
        this.logic = new LogicLayer()
        this.svg = new SvgLayer(draw)

        this.user = cloneDeep(user)
    }

    public renderInitial() {
        this.svg.initialState()
    }

    public handleGameProgressResponse(game: GameProgressDataset) {
        this.logic.setDataset(game)

        if (this.logic.getCurrentPlayerId() == this.user.userId) {
            this.boardState = SvgBoardStates.DICE
            this.svg.diceState()
        } else {
            this.boardState = SvgBoardStates.WAITING
            this.svg.waitingState()
        }
    }

    public async handleDocumentClick(clickData: DocumentClickData) {
        console.log(clickData);
        
        switch (this.boardState) {
            case SvgBoardStates.DICE: 
                if (!clickData.dice) return

                this.boardState = SvgBoardStates.DICE_ANIMATION
                await this.svg.diceAnimationState(this.logic.getLastDiceSequence())

                this.boardState = SvgBoardStates.DICE_PLAY_BUTTON
                this.svg.dicePlayButtonState()
        }
    }
}