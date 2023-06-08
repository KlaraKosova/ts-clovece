import {Svg} from "@svgdotjs/svg.js";
import {SvgLayer} from "@/gameProgressControls/SvgLayer";
import {SvgBoardStates} from "@/types/state/SvgBoardStates";
import {LogicLayer} from "@/gameProgressControls/LogicLayer";
import { GameProgressDataset } from "@/types/data/GameProgressDataset";
import {UserInfo} from "@/types/common/UserInfo";
import {DocumentClickData} from "@/types/state/DocumentClickData";
import { objectCompare } from "@/utils/common";
import { SocketIOClientInstance } from "@/socketio/SocketClient";
import { GameProgressUpdate } from "@/types/data/GameProgressUpdate";
import { PromiseInspectorInstance } from "@/utils/PromiseInspector";
import {ModalEventBusInstance} from "@/gameProgressControls/modals/ModalEventBus";
import {ModalEventTypes} from "@/types/state/ModalEventBusEventTypes";

export class State {
    private _boardState: SvgBoardStates
    private get boardState() { return this._boardState}
    private set boardState (value) {
        // debug
        /* try {
            throw new Error("boardState assignment")
        } catch (e) {
            console.log(e);   
        } */

        this._boardState = value
    }
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
        console.log(data);
        console.log(this.boardState);
        
        let handlePromise: Promise<void> | undefined
        
        switch(this.boardState) {
            case SvgBoardStates.DICE:
                handlePromise = this.handleDocumentClick_diceState(data)
                break
            case SvgBoardStates.DICE_PLAY_BUTTON:
                handlePromise = this.handleDocumentClick_dicePlayButtonState(data)
                break
            case SvgBoardStates.HIGHLIGHT_ANIMATION:
                handlePromise = this.handleDocumentClick_highlightAnimationState(data)
                break
            case SvgBoardStates.NO_MOVES_MODAL:
                handlePromise = this.handleDocumentClick_noMovesModalState(data)
                break
        }

        if (handlePromise) {
            PromiseInspectorInstance.add(handlePromise)
            await handlePromise
            
        }
    }

    public async handleGameProgressUpdate(data: { progress: GameProgressDataset, updates: GameProgressUpdate[] }) {
        await PromiseInspectorInstance.waitForAll()

        this.boardState = SvgBoardStates.NEXT_PLAYER_FIGURE_MOVE_ANIMATION

        if (this.logic.getCurrentPlayerId() !== this.user.userId) {
            // prevent running same animation twice
            await this.svg.animateUpdates(data.updates)
        }
        this.logic.setDataset(data.progress)

        console.log(this.logic.getDataset())
        console.log(this.user);
        
        

        if (this.currentPlayerTurn()) {
            console.log('zde?');
            
            this.boardState = SvgBoardStates.DICE
            this.svg.diceState()
        } else {
            console.log('???');
            
            this.svg.waitingState()
            this.boardState = SvgBoardStates.WAITING
        }
    }

    private async handleDocumentClick_diceState(data: DocumentClickData) {
        if (!data.dice) {
            return
        }

        console.log('here');
        

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
            // TODO
            /* if (available.homeMovesOnly) {            
                this.boardState = SvgBoardStates.HOME_MOVES_ONLY_MODAL
                this.svg.homeMovesOnlyModalState()
            } else { */
                this.boardState = SvgBoardStates.HIGHLIGHT_ANIMATION
                this.svg.highlightAnimationState(available)
            /* } */
        } else {
            this.boardState = SvgBoardStates.NO_MOVES_MODAL
            ModalEventBusInstance.publish(ModalEventTypes.SHOW_NO_MOVES_MODAL)
            this.svg.noMovesModalState()
        }
    }

    private async handleDocumentClick_highlightAnimationState(data: DocumentClickData) {
        if (!data.field && !data.figure) {
            return
        }

        const available = this.logic.getAvailable()
        const availableIncludesField = available.fields.some(f => objectCompare(f, data.field))
        const availableIncludesFigure = available.figures.some(f => objectCompare(f, data.figure))

        if (!availableIncludesField && !availableIncludesFigure) {
            return
        }

        this.boardState = SvgBoardStates.CURRENT_PLAYER_FIGURE_MOVE_ANIMATION
        const updates = this.logic.getUpdates({field: data.field, figure: data.figure})
        SocketIOClientInstance.socket.emit("CLIENT_GAME_PROGRESS_UPDATE", updates)
        
        await this.svg.currentPlayerFigureMoveAnimationState(updates)

        this.boardState = SvgBoardStates.WAITING
    }

    private async handleDocumentClick_noMovesModalState(data: DocumentClickData) {
        if (!data.nextPlayerButton) {
            return
        }

        SocketIOClientInstance.socket.emit("CLIENT_GAME_PROGRESS_UPDATE", [])

        this.svg.waitingState()
        ModalEventBusInstance.publish(ModalEventTypes.CLEAR_ALL_MODALS)
        this.boardState = SvgBoardStates.WAITING
    }
}