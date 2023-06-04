import {Svg} from "@svgdotjs/svg.js";
import { GameElementsDict } from "@/types/svgLayer/GameElementsDict";
import {PlayerColors, PlayersOrder} from "@/types/common/PlayerColors";
import { StaticBackground } from "./svgLayer/StaticBackground";
import {SvgElements} from "@/types/svgLayer/SvgElements";
import { Overlay } from "./svgLayer/Overlay";
import { NoMovesModal } from "./svgLayer/NoMovesModal";
import { DicePlayButton } from "./svgLayer/DicePlayButton";
import { Dice } from "./svgLayer/Dice";
import { NextPlayerButton } from "./svgLayer/NextPlayerButton";
import { Loading } from "./svgLayer/Loading";
import { Field } from "./svgLayer/Field";
import { Figure } from "./svgLayer/Figure";

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
            [SvgElements.NO_MOVES_MODAL]: new NoMovesModal(this.draw),
            [SvgElements.NEXT_PLAYER_BUTTON]: new NextPlayerButton(this.draw),
            [SvgElements.LOADING]: new Loading(this.draw)
        }
    }

    public renderInitial() {
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
}