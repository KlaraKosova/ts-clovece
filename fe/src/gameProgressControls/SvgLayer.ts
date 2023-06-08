import {Svg} from "@svgdotjs/svg.js";
import { GameElementsDict } from "@/types/svgLayer/GameElementsDict";
import {PlayerColors, PlayersOrder} from "@/types/common/PlayerColors";
import { StaticBackground } from "./svgLayer/StaticBackground";
import {SvgElements} from "@/types/svgLayer/SvgElements";
import { Overlay } from "./svgLayer/Overlay";
import { DicePlayButton } from "./svgLayer/DicePlayButton";
import { Dice } from "./svgLayer/Dice";
import { Loading } from "./svgLayer/Loading";
import { Field } from "./svgLayer/Field";
import { Figure } from "./svgLayer/Figure";
import {GameProgressDataset} from "@/types/data/GameProgressDataset";
import {FieldDataset} from "@/types/data/FieldDataset";
import { FigureDataset } from "@/types/data/FigureDataset";
import { GameProgressUpdate } from "@/types/data/GameProgressUpdate";

export class SvgLayer {
    private draw: Svg
    private gameElementsDict: GameElementsDict

    constructor(draw: Svg) {
        this.draw = draw
        this.init()
    }
    private init() {
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
                isStart: false,
            });
        }

        PlayersOrder.forEach((playerColor, index) => {
            const path = [] as Field[]
            const pathStart = index * 10;
            for (let i = 0; i < 40; i++) {
                const field = /*this.*/mainFields[(pathStart + i) % 40];
                path.push(field);
            }

            startFields[playerColor] = [];
            homeFields[playerColor] = [];
            figures[playerColor] = [];

            for (let i = 0; i < 4; i++) {
                const homeField = new Field(this.draw, {
                    index: i,
                    color: playerColor,
                    isHome: true,
                    isStart: false,
                });
                const startField = new Field(this.draw, {
                    index: i,
                    color: playerColor,
                    isHome: false,
                    isStart: true,
                });

                homeFields[playerColor].push(homeField);
                startFields[playerColor].push(startField);
                path.push(homeField)
            }

            for (let i = 0; i < 4; i++) {
                const figure = new Figure(this.draw, { color: playerColor, index: i }, startFields[playerColor][i]);
                figure.setPath(path)
                figures[playerColor].push(figure);
            }
        });

        this.gameElementsDict = {
            [SvgElements.STATIC_BACKGROUND]: background,
            [SvgElements.MAIN_FIELDS]: mainFields,
            [SvgElements.START_FIELDS]: startFields,
            [SvgElements.HOME_FIELDS]: homeFields,
            [SvgElements.FIGURES]: figures,
            [SvgElements.OVERLAY]: new Overlay(this.draw),
            [SvgElements.DICE]: new Dice(this.draw),
            [SvgElements.DICE_PLAY_BUTTON]: new DicePlayButton(this.draw),
            [SvgElements.LOADING]: new Loading(this.draw),
        }
    }

    public loadedProgressState(game: GameProgressDataset) {
        PlayersOrder.forEach((color: PlayerColors) => {
            for (let i = 0; i < 4; i++) {
                const progressPosition = game.playerStatuses[color].figures[i];
                const field = this.getFieldByFieldDataset(progressPosition)
                this.gameElementsDict[SvgElements.FIGURES][color][i].setField(field);
                this.gameElementsDict[SvgElements.FIGURES][color][i].render();
            }
        })
    }

    public initialState() {
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

    public diceState() {
        this.gameElementsDict.LOADING.clear()

        this.gameElementsDict.OVERLAY.render()
        this.gameElementsDict.DICE.render()
    }

    public waitingState() {
        this.stopAllHighlightAnimations()

        this.gameElementsDict.OVERLAY.clear()
        this.gameElementsDict.LOADING.clear()
        this.gameElementsDict.DICE.clear()
        this.gameElementsDict.DICE_PLAY_BUTTON.clear()
    }

    public async diceAnimationState(sequence: number[]) {
        await this.gameElementsDict.DICE.animateDotsSequence(sequence)
        this.gameElementsDict.DICE_PLAY_BUTTON.render()

        this.gameElementsDict.DICE.animateMoveUp()
        this.gameElementsDict.DICE_PLAY_BUTTON.animateMoveDown()
    }

    public noMovesState() {
        this.gameElementsDict.DICE.clear()
        this.gameElementsDict.DICE_PLAY_BUTTON.clear()

        this.gameElementsDict.OVERLAY.clear()
    }

    public highlightAnimationState(available: {fields: FieldDataset[], figures: FigureDataset[]}) {
        this.gameElementsDict.OVERLAY.clear()
        this.gameElementsDict.DICE.clear()
        this.gameElementsDict.DICE_PLAY_BUTTON.clear()


        available.fields.forEach(fieldDataset => {
            const field = this.getFieldByFieldDataset(fieldDataset)
            field.highlightAnimationStart()
        })
        available.figures.forEach(figureDataset => {
            const figure = this.getFigureByFigureDataset(figureDataset)
            figure.highlightAnimationStart()
        })
    }

    public async homeMovesOnlyModalState() {
        this.gameElementsDict.DICE.clear()
        this.gameElementsDict.DICE_PLAY_BUTTON.clear()

        this.gameElementsDict.OVERLAY.render()
    }

    public async currentPlayerFigureMoveAnimationState(updates: GameProgressUpdate[]) {
        this.stopAllHighlightAnimations()

        await this.animateUpdates(updates)
    }

    public async animateUpdates(updates: GameProgressUpdate[]) {
        for (const update of updates) {
            const figure = this.getFigureByFigureDataset(update.figure)
            const nextField = this.getFieldByFieldDataset(update.nextField)
            const prevField = this.getFieldByFieldDataset(update.prevField)

            if (update.type === "MOVE") {
                await figure.animateMoveSequence(nextField)
            } else if (update.type === 'KICK') {
                await figure.animateKickSequence(nextField)
            }
        }
    }

    private stopAllHighlightAnimations() {
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

    private getFieldByFieldDataset(field: FieldDataset): Field {
        if (field.isHome) {
            return this.gameElementsDict.HOME_FIELDS[field.color][field.index]
        }
        if (field.isStart) {
            return this.gameElementsDict.START_FIELDS[field.color][field.index]
        }
        return this.gameElementsDict.MAIN_FIELDS[field.index]
    }

    private getFigureByFigureDataset(figure: FigureDataset): Figure {
        return this.gameElementsDict.FIGURES[figure.color][figure.index]
    }
}