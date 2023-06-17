import { type Svg } from '@svgdotjs/svg.js'
import { type GameElementsDict } from '@/types/GameElementsDict'
import { type PlayerColors, PlayersOrder } from '@/types/PlayerColors'
import { StaticBackground } from './svgLayer/StaticBackground'
import { Overlay } from './svgLayer/Overlay'
import { DicePlayButton } from './svgLayer/DicePlayButton'
import { Dice } from './svgLayer/Dice'
import { Loading } from './svgLayer/Loading'
import { Field } from './svgLayer/Field'
import { Figure } from './svgLayer/Figure'
import { type GameProgressDTO } from '@/types/dtos/GameProgressDTO'
import { type FieldDTO } from '@/types/dtos/FieldDTO'
import { type FigureDTO } from '@/types/dtos/FigureDTO'
import { type GameProgressUpdateDTO } from '@/types/dtos/GameProgressUpdateDTO'
import { WinnerModal } from './svgLayer/WinnerModal'

export class SvgLayer {
    private readonly draw: Svg
    private gameElementsDict: GameElementsDict

    constructor(draw: Svg) {
        this.draw = draw
        this.init()
    }

    private init(): void {
        const background = new StaticBackground(this.draw)
        const startFields = {} as Record<PlayerColors, Field[]>
        const homeFields = {} as Record<PlayerColors, Field[]>
        const figures = {} as Record<PlayerColors, Figure[]>
        const mainFields = [] as Field[]

        for (let i = 0; i < 40; i++) {
            mainFields[i] = new Field(this.draw, {
                index: i,
                color:
                    i % 10 === 0 ? (`${Math.floor(i / 10)}` as PlayerColors) : null,
                isHome: false,
                isStart: false
            })
        }

        PlayersOrder.forEach((playerColor, index) => {
            const path = [] as Field[]
            const pathStart = index * 10
            for (let i = 0; i < 40; i++) {
                const field = mainFields[(pathStart + i) % 40]
                path.push(field)
            }

            startFields[playerColor] = []
            homeFields[playerColor] = []
            figures[playerColor] = []

            for (let i = 0; i < 4; i++) {
                const homeField = new Field(this.draw, {
                    index: i,
                    color: playerColor,
                    isHome: true,
                    isStart: false
                })
                const startField = new Field(this.draw, {
                    index: i,
                    color: playerColor,
                    isHome: false,
                    isStart: true
                })

                homeFields[playerColor].push(homeField)
                startFields[playerColor].push(startField)
                path.push(homeField)
            }

            for (let i = 0; i < 4; i++) {
                const figure = new Figure(this.draw, { color: playerColor, index: i }, startFields[playerColor][i])
                figure.setPath(path)
                figures[playerColor].push(figure)
            }
        })

        this.gameElementsDict = {
            STATIC_BACKGROUND: background,
            MAIN_FIELDS: mainFields,
            START_FIELDS: startFields,
            HOME_FIELDS: homeFields,
            FIGURES: figures,
            OVERLAY: new Overlay(this.draw),
            DICE: new Dice(this.draw),
            DICE_PLAY_BUTTON: new DicePlayButton(this.draw),
            LOADING: new Loading(this.draw),
            WINNER_MODAL: new WinnerModal(this.draw)
        }
    }

    public loadedProgressState(game: GameProgressDTO): void {
        PlayersOrder.forEach((color: PlayerColors) => {
            for (let i = 0; i < 4; i++) {
                const progressPosition = game.playerStatuses[color].figures[i]
                const field = this.getFieldByFieldDTO(progressPosition)
                this.gameElementsDict.FIGURES[color][i].setField(field)
                this.gameElementsDict.FIGURES[color][i].render()
            }
        })
    }

    public initialState(): void {
        this.gameElementsDict.STATIC_BACKGROUND.render()

        for (let i = 0; i < 40; i++) {
            this.gameElementsDict.MAIN_FIELDS[i].render()
        }

        PlayersOrder.forEach((playerColor, index) => {
            for (let i = 0; i < 4; i++) {
                this.gameElementsDict.HOME_FIELDS[playerColor][i].render()
                this.gameElementsDict.START_FIELDS[playerColor][i].render()

                this.gameElementsDict.FIGURES[playerColor][i].render()
            }
        })

        this.gameElementsDict.OVERLAY.render()
        this.gameElementsDict.LOADING.render()
        this.gameElementsDict.LOADING.runAnimation()
    }

    public diceState(): void {
        this.gameElementsDict.LOADING.clear()

        this.gameElementsDict.OVERLAY.render()
        this.gameElementsDict.DICE.render()
    }

    public waitingState(): void {
        this.stopAllHighlightAnimations()

        this.gameElementsDict.OVERLAY.clear()
        this.gameElementsDict.LOADING.clear()
        this.gameElementsDict.DICE.clear()
        this.gameElementsDict.DICE_PLAY_BUTTON.clear()
    }

    public async diceAnimationState(sequence: number[]): Promise<void> {
        await this.gameElementsDict.DICE.animateDotsSequence(sequence)
        this.gameElementsDict.DICE_PLAY_BUTTON.render()

        const moveUpPromise = this.gameElementsDict.DICE.animateMoveUp()
        const moveDownPromise = this.gameElementsDict.DICE_PLAY_BUTTON.animateMoveDown()

        await Promise.all([moveUpPromise, moveDownPromise])
    }

    public noMovesState(): void {
        this.gameElementsDict.DICE.clear()
        this.gameElementsDict.DICE_PLAY_BUTTON.clear()

        this.gameElementsDict.OVERLAY.clear()
    }

    public highlightAnimationState(available: { fields: FieldDTO[], figures: FigureDTO[] }): void {
        this.gameElementsDict.OVERLAY.clear()
        this.gameElementsDict.DICE.clear()
        this.gameElementsDict.DICE_PLAY_BUTTON.clear()

        available.fields.forEach(fieldDTO => {
            const field = this.getFieldByFieldDTO(fieldDTO)
            field.highlightAnimationStart()
        })
        available.figures.forEach(figureDTO => {
            const figure = this.getFigureByFigureDTO(figureDTO)
            figure.highlightAnimationStart()
        })
    }

    public async homeMovesOnlyModalState(): Promise<void> {
        this.gameElementsDict.DICE.clear()
        this.gameElementsDict.DICE_PLAY_BUTTON.clear()

        this.gameElementsDict.OVERLAY.render()
    }

    public async currentPlayerFigureMoveAnimationState(updates: GameProgressUpdateDTO[]): Promise<void> {
        this.stopAllHighlightAnimations()

        await this.animateUpdates(updates)
    }

    public async winnerModalState(winnerColor: PlayerColors, playerColor: PlayerColors): Promise<void> {
        this.gameElementsDict.LOADING.clear()
        this.gameElementsDict.DICE.clear()
        this.gameElementsDict.DICE_PLAY_BUTTON.clear()

        this.gameElementsDict.OVERLAY.render()

        this.gameElementsDict.WINNER_MODAL.setWinnerColor(winnerColor)
        this.gameElementsDict.WINNER_MODAL.setPlayerColor(playerColor)
        this.gameElementsDict.WINNER_MODAL.render()
        await this.gameElementsDict.WINNER_MODAL.runAnimation()
    }

    public async animateUpdates(updates: GameProgressUpdateDTO[]): Promise<void> {
        for (const update of updates) {
            const figure = this.getFigureByFigureDTO(update.figure)
            const nextField = this.getFieldByFieldDTO(update.nextField)

            if (update.type === 'MOVE') {
                await figure.animateMoveSequence(nextField)
            } else if (update.type === 'KICK') {
                await figure.animateKickSequence(nextField)
            }
        }
    }

    private stopAllHighlightAnimations(): void {
        for (let i = 0; i < 40; i++) {
            this.gameElementsDict.MAIN_FIELDS[i].highlightAnimationStop()
        }

        PlayersOrder.forEach(playerColor => {
            for (let i = 0; i < 4; i++) {
                this.gameElementsDict.HOME_FIELDS[playerColor][i].highlightAnimationStop()
                this.gameElementsDict.START_FIELDS[playerColor][i].highlightAnimationStop()
                this.gameElementsDict.FIGURES[playerColor][i].highlightAnimationStop()
            }
        })
    }

    private getFieldByFieldDTO(field: FieldDTO): Field {
        if (field.isHome) {
            return this.gameElementsDict.HOME_FIELDS[field.color][field.index]
        }
        if (field.isStart) {
            return this.gameElementsDict.START_FIELDS[field.color][field.index]
        }
        return this.gameElementsDict.MAIN_FIELDS[field.index]
    }

    private getFigureByFigureDTO(figure: FigureDTO): Figure {
        return this.gameElementsDict.FIGURES[figure.color][figure.index]
    }
}
