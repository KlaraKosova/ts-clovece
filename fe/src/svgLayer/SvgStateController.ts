import { Svg } from "@svgdotjs/svg.js";
import { SvgElements } from "../types/svgLayer/SvgElements";
import { SvgElement } from "./elements/base/SvgElement";
import { StaticBackground } from "./elements/StaticBackground";
import { Field } from "./elements/Field";
import { PlayerColors, PlayersOrder } from "../types/common/PlayerColors";
import { Dice } from "./elements/Dice";
import { DicePlayButton } from "./elements/DicePlayButton";
import { Loading } from "./elements/Loading";
import { NextPlayerButton } from "./elements/NextPlayerButton";
import { NoMovesModal } from "./elements/NoMovesModal";
import { Overlay } from "./elements/Overlay";
import { Figure } from "./elements/Figure";
import { GameElement } from "./elements/base/GameElement"
import { GameElementDict } from "../types/svgLayer/GameElementsDict";
import { GameProgressDataset } from "../types/data/GameProgressDataset";

export class SvgStateController {
    private gameElementDict: GameElementDict
    private draw: Svg

    constructor(draw: Svg) {
        this.draw = draw
        this.init()
    }

    private init() {
        // init background first until support for layers is implemented
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

        this.gameElementDict = {
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

    public renderInitial() {
        this.gameElementDict.BACKGROUND.render()
        this.gameElementDict.MAIN_FIELDS.forEach(f => f.render())
        for (const color of PlayersOrder) {
            this.gameElementDict.HOME_FIELDS[color].forEach(f => f.render())
            this.gameElementDict.START_FIELDS[color].forEach(f => f.render())
        }

        this.gameElementDict.OVERLAY.render()
        this.gameElementDict.LOADING.render()
        this.gameElementDict.LOADING.runAnimation()
        console.log(this.gameElementDict);
    }

    public renderInitialFigures(dataset: GameProgressDataset) {
        for (const color of PlayersOrder) {
            for(let i = 0; i < 4; i++) {
                const figurePositionDataset = dataset.playerStatuses[color].figures[i]
                this.gameElementDict.FIGURES[color][i].setDataset(figurePositionDataset)
                this.gameElementDict.FIGURES[color][i].render()
            }
        }
    }
}