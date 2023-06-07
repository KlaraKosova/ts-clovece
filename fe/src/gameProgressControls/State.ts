import {Svg} from "@svgdotjs/svg.js";
import {SvgLayer} from "@/gameProgressControls/SvgLayer";
import {SvgBoardStates} from "@/types/state/SvgBoardStates";
import {LogicLayer} from "@/gameProgressControls/LogicLayer";
import { GameProgressDataset } from "@/types/data/GameProgressDataset";
import {UserInfo} from "@/types/common/UserInfo";
import {DocumentClickData} from "@/types/state/DocumentClickData";

export class State {
    private boardState: SvgBoardStates;
    private svg: SvgLayer
    private logic: LogicLayer
    private user: UserInfo

    constructor(draw: Svg, user: UserInfo) {
        this.boardState = SvgBoardStates.LOADING

        this.svg = new SvgLayer(draw)
        this.logic = new LogicLayer(user)
        this.user = user
    }

    private currentPlayerTurn() {
        return this.logic.getCurrentPlayerId() === this.user.userId
    }

    public renderInitial() {
        this.svg.initialState()
    }

    public handleGameProgressResponse(game: GameProgressDataset) {
        this.logic.setDataset(game)
        this.svg.loadedProgressState(game)

        if (this.currentPlayerTurn()) {
            this.svg.diceState()
            this.boardState = SvgBoardStates.DICE
        } else {
            this.svg.waitingState()
            this.boardState = SvgBoardStates.WAITING
        }
    }

    public async handleDocumentClick(data: DocumentClickData) {
        switch(this.boardState) {
            case SvgBoardStates.DICE:
                await this.handleDocumentClick_diceState(data)
                break
            case SvgBoardStates.DICE_PLAY_BUTTON:
                await this.handleDocumentClick_dicePlayButtonState(data)
                break
        }
    }

    private async handleDocumentClick_diceState(data: DocumentClickData) {
        if (!data.dice) {
            return
        }

        this.boardState = SvgBoardStates.DICE_ANIMATION
        await this.svg.diceAnimationState(this.logic.getDiceSequence())
        this.boardState = SvgBoardStates.DICE_PLAY_BUTTON
    }

    private async handleDocumentClick_dicePlayButtonState(data: DocumentClickData) {
        if (!data.playButton) {
            return
        }

        const available = this.logic.getAvailable()
        if (available.fields.length) {
            this.boardState = SvgBoardStates.HIGHLIGHT_ANIMATION
            console.log(available)
        } else {
            this.boardState = SvgBoardStates.NO_MOVES_MODAL
            this.svg.noMovesModalState()
        }
        /* this.gameElementsDict.DICE.clear();
        this.gameElementsDict.DICE_PLAY_BUTTON.clear();
        this.gameElementsDict.OVERLAY.clear();
        this.showMoveOptions(); */
    }
}