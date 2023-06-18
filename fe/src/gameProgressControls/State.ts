import { type Svg } from '@svgdotjs/svg.js'
import { SvgLayer } from '@/gameProgressControls/SvgLayer'
import { SvgBoardStates } from '@/types/SvgBoardStates'
import { LogicLayer } from '@/gameProgressControls/LogicLayer'
import { type GameProgressDTO } from '@/types/dtos/GameProgressDTO'
import { type UserInfo } from '@/types/UserInfo'
import { type DocumentClickData } from '@/types/DocumentClickData'
import { objectCompare } from '@/utils/common'
import { SocketIOClientInstance } from '@/socketio/SocketClient'
import { type GameProgressUpdateDTO } from '@/types/dtos/GameProgressUpdateDTO'
import { PromiseInspectorInstance } from '@/utils/PromiseInspector'
import { ModalEventBusInstance } from '@/gameProgressControls/modals/ModalEventBus'
import { ModalEventTypes } from '@/types/ModalEventBusEventTypes'
import { type PlayerColors } from '@/types/PlayerColors'

export class State {
    private boardState: SvgBoardStates
    private readonly svg: SvgLayer
    private readonly logic: LogicLayer
    private readonly user: UserInfo

    constructor(draw: Svg, user: UserInfo) {
        this.boardState = SvgBoardStates.LOADING

        this.svg = new SvgLayer(draw)
        this.logic = new LogicLayer(user)
        this.user = user
    }

    private currentPlayerTurn(): boolean {
        return this.logic.getCurrentPlayerId() === this.user.userId
    }

    public getWinnerColor(): PlayerColors | null {
        return this.logic.getWinnerColor()
    }

    public getCurrentColor(): PlayerColors {
        return this.logic.getCurrentColor()
    }

    public renderInitial(): void {
        this.svg.initialState()
    }

    public async handleGameProgressResponse(game: GameProgressDTO): Promise<void> {
        this.logic.setDTO(game)
        this.svg.loadedProgressState(game)
        const winnerColor = this.logic.getWinnerColor()

        if (winnerColor !== null) {
            this.boardState = SvgBoardStates.WINNER_MODAL
            ModalEventBusInstance.publish(ModalEventTypes.CLEAR_ALL)
            ModalEventBusInstance.publish(ModalEventTypes.SHOW_GAME_OVER_MODAL, { winnerColor })
            await this.svg.winnerModalState(winnerColor, this.user.color)
            return
        }

        const currentPlayerColor = this.getCurrentColor()
        ModalEventBusInstance.publish(ModalEventTypes.CLEAR_ALL)
        ModalEventBusInstance.publish(ModalEventTypes.SHOW_CURRENT_PLAYER_MODAL, { currentPlayerColor })

        if (this.currentPlayerTurn()) {
            this.svg.diceState()
            this.boardState = SvgBoardStates.DICE
        } else {
            this.svg.waitingState()
            this.boardState = SvgBoardStates.WAITING
        }
    }

    public async handleDocumentClick(data: DocumentClickData): Promise<void> {
        let handlePromise: Promise<void> | undefined

        switch (this.boardState) {
            case SvgBoardStates.DICE:
                handlePromise = this.handleDocumentClick_diceState(data)
                break
            case SvgBoardStates.DICE_PLAY_BUTTON:
                handlePromise = this.handleDocumentClick_dicePlayButtonState(data)
                break
            case SvgBoardStates.HIGHLIGHT_ANIMATION:
                handlePromise = this.handleDocumentClick_highlightAnimationState(data)
                break
            case SvgBoardStates.NO_MOVES:
                handlePromise = this.handleDocumentClick_noMovesModalState(data)
                break
            case SvgBoardStates.HOME_MOVES_ONLY:
                handlePromise = this.handleDocumentClick_homeMovesOnlyState(data)
                break
        }

        if (handlePromise !== undefined) {
            await PromiseInspectorInstance.add(handlePromise)
            await handlePromise
        }
    }

    public async handleGameProgressUpdate(data: { progress: GameProgressDTO, updates: GameProgressUpdateDTO[] }): Promise<void> {
        await PromiseInspectorInstance.waitForAll()

        this.boardState = SvgBoardStates.NEXT_PLAYER_FIGURE_MOVE_ANIMATION

        if (this.logic.getCurrentPlayerId() !== this.user.userId) {
            // prevent running same animation twice
            await this.svg.animateUpdates(data.updates)
        }
        this.logic.setDTO(data.progress)

        if (this.currentPlayerTurn()) {
            this.boardState = SvgBoardStates.DICE
            this.svg.diceState()
        } else {
            this.svg.waitingState()
            this.boardState = SvgBoardStates.WAITING
        }
    }

    public async handleGameWinnerUpdate(data: { winnerId: string }): Promise<void> {
        this.boardState = SvgBoardStates.WINNER_MODAL

        const winnerColor = this.logic.getPlayerColorById(data.winnerId)
        ModalEventBusInstance.publish(ModalEventTypes.CLEAR_ALL)
        ModalEventBusInstance.publish(ModalEventTypes.SHOW_GAME_OVER_MODAL, { winnerColor })

        await this.svg.winnerModalState(winnerColor, this.user.color)
    }

    private async handleDocumentClick_diceState(data: DocumentClickData): Promise<void> {
        if (!data.dice) {
            return
        }

        this.boardState = SvgBoardStates.DICE_ANIMATION
        await this.svg.diceAnimationState(this.logic.getDiceSequence())
        this.boardState = SvgBoardStates.DICE_PLAY_BUTTON
    }

    private async handleDocumentClick_dicePlayButtonState(data: DocumentClickData): Promise<void> {
        if (!data.playButton) {
            return
        }

        const available = this.logic.getAvailable()
        console.log(available)
        if (available.fields.length > 0) {
            if (available.homeMovesOnly) {
                ModalEventBusInstance.publish(ModalEventTypes.SHOW_HOME_MOVES_ONLY_MODAL)
                this.boardState = SvgBoardStates.HOME_MOVES_ONLY
                this.svg.highlightAnimationState(available)
            } else {
                this.boardState = SvgBoardStates.HIGHLIGHT_ANIMATION
                this.svg.highlightAnimationState(available)
            }
        } else {
            this.boardState = SvgBoardStates.NO_MOVES
            ModalEventBusInstance.publish(ModalEventTypes.SHOW_NO_MOVES_MODAL)

            this.svg.noMovesState()
        }
    }

    private async handleDocumentClick_highlightAnimationState(data: DocumentClickData): Promise<void> {
        if (!data.field && !data.figure) {
            return
        }

        await this.handleHighlightAnimationStateClicked(data)
    }

    private async handleDocumentClick_noMovesModalState(data: DocumentClickData): Promise<void> {
        if (!data.nextPlayerButton) {
            return
        }

        this.handleEmptyUpdates()
        ModalEventBusInstance.publish(ModalEventTypes.CLEAR_ALL)
    }

    private async handleDocumentClick_homeMovesOnlyState(data: DocumentClickData): Promise<void> {
        if (!data.nextPlayerButton && !data.field && !data.figure) {
            return
        }

        if (data.nextPlayerButton) {
            this.handleEmptyUpdates()
        } else {
            await this.handleHighlightAnimationStateClicked(data)
        }

        ModalEventBusInstance.publish(ModalEventTypes.CLEAR_ALL)
    }

    private handleEmptyUpdates(): void {
        SocketIOClientInstance.socket.emit('CLIENT_GAME_PROGRESS_UPDATE', [])

        this.svg.waitingState()
        this.boardState = SvgBoardStates.WAITING
    }

    private async handleHighlightAnimationStateClicked(data: DocumentClickData): Promise<void> {
        const available = this.logic.getAvailable()
        const availableIncludesField = available.fields.some(f => objectCompare(f, data.field))
        const availableIncludesFigure = available.figures.some(f => objectCompare(f, data.figure))

        if (!availableIncludesField && !availableIncludesFigure) {
            return
        }

        this.boardState = SvgBoardStates.CURRENT_PLAYER_FIGURE_MOVE_ANIMATION
        const updates = this.logic.getUpdates(this.user.color, { field: data.field, figure: data.figure })
        SocketIOClientInstance.socket.emit('CLIENT_GAME_PROGRESS_UPDATE', updates)

        await this.svg.currentPlayerFigureMoveAnimationState(updates)

        this.boardState = SvgBoardStates.WAITING
    }
}
