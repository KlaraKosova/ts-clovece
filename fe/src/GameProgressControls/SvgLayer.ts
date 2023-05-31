import { Svg } from "@svgdotjs/svg.js";
import { SvgBoardStates } from "../types/board/SvgBoardStates";
import { GameElementsDict } from "../types/board/GameElementsDict";
import { Field } from "../svgElements/elements/Field";
import { Figure } from "../svgElements/elements/Figure";
import { Dice } from "../svgElements/elements/Dice";
import { DicePlayButton } from "../svgElements/elements/DicePlayButton";
import { Loading } from "../svgElements/elements/Loading";
import { NextPlayerButton } from "../svgElements/elements/NextPlayerButton";
import { NoMovesModal } from "../svgElements/elements/NoMovesModal";
import { Overlay } from "../svgElements/elements/Overlay";
import { StaticBackground } from "../svgElements/elements/StaticBackground";
import { SvgElements } from "../types/board/SvgElements";
import { PlayerColors, PlayersOrder } from "../types/common/PlayerColors";

export class SvgLayer {
    private draw: Svg
    private boardState: SvgBoardStates;
    private gameElementsDict: GameElementsDict

    constructor (draw: Svg) {
        this.draw = draw
        this.boardState = SvgBoardStates.LOADING

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
            [SvgElements.BACKGROUND]: background,
            [SvgElements.MAIN_FIELDS]: mainFields,
            [SvgElements.START_FIELDS]: startFields,
            [SvgElements.HOME_FIELDS]: homeFields,
            [SvgElements.FIGURES]: figures,
            [SvgElements.OVERLAY]: new Overlay(this.draw),
            [SvgElements.DICE]: new Dice(this.draw),
            [SvgElements.DICE_PLAY_BUTTON]: new DicePlayButton(this.draw),
            [SvgElements.NO_MOVES_MODAL]: new NoMovesModal(this.draw),
            [SvgElements.NEXT_PLAYER_BUTTON]: new NextPlayerButton(this.draw),
            [SvgElements.LOADING]: new Loading(this.draw)
        }
    }

    public initialState() {
        this.boardState = SvgBoardStates.LOADING
        this.renderStatic()
        this.gameElementsDict.OVERLAY.render()
        this.gameElementsDict.LOADING.render()
        this.gameElementsDict.LOADING.runAnimation()
    }

    private renderStatic() {
        this.gameElementsDict.BACKGROUND.render();
        for (let i = 0; i < 40; i++) {
            this.gameElementsDict.MAIN_FIELDS[i].render();
        }
        PlayersOrder.forEach((playerColor) => {
            for (let i = 0; i < 4; i++) {
                this.gameElementsDict.START_FIELDS[playerColor][i].render();
                this.gameElementsDict.HOME_FIELDS[playerColor][i].render();
                this.gameElementsDict.FIGURES[playerColor][i].render();
            }
        });
    }

    public waitingState() {
        this.gameElementsDict.OVERLAY.clear()
        this.gameElementsDict.LOADING.clear()

        this.boardState = SvgBoardStates.WAITING
    }

    public diceState() {
        this.gameElementsDict.LOADING.clear()
        this.gameElementsDict.DICE.render()

        this.boardState = SvgBoardStates.DICE
    }

    public async diceAnimationState(sequence: number[]) {
        await this.gameElementsDict.DICE.animateDotsSequence(sequence);
    }

    public dicePlayButtonState() {
        this.gameElementsDict.DICE.animateMoveUp()
        this.gameElementsDict.DICE_PLAY_BUTTON.render();
        this.gameElementsDict.DICE_PLAY_BUTTON.animateMoveDown()
    }
}