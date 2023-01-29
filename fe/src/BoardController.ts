import { Svg } from "@svgdotjs/svg.js";
import { centers, homeCenters } from "./helpers/fieldCenters";
import { Field } from "./svgElements/Field";
import { Figure } from "./svgElements/Figure";
import { StaticBackground } from "./svgElements/StaticBackground";
import {
    FieldInfo,
    PlayersOrder,
    PlayerColor,
    SvgBoardStates,
    GameProgress,
    PlayerColors,
    DocumentClickData,
} from "./types";
import App from "./App";
import { Dice } from "./svgElements/Dice";
import { Overlay } from "./svgElements/Overlay";
import { DicePlayButton } from "./svgElements/DicePlayButton";
import { objectCompare } from "./helpers/common";

export class BoardController {
    private readonly draw: Svg;
    private boardState: SvgBoardStates;
    private gameProgress: GameProgress;
    private background: StaticBackground;
    private overlay: Overlay;
    private dicePlayButton: DicePlayButton;
    private dice: Dice;
    private mainFields = [] as Field[];
    private homeFields = {} as Record<PlayerColor, Field[]>;
    private startFields = {} as Record<PlayerColor, Field[]>;
    private figures = {} as Record<PlayerColor, Figure[]>;
    private paths = {} as Record<PlayerColor, FieldInfo[]>;
    constructor(draw: Svg) {
        this.draw = draw;
        this.boardState = SvgBoardStates.BEFORE_LOAD;
        this.init();
        this.constructPlayerPaths();
    }
    public updateGameProgress(progress: GameProgress) {
        this.gameProgress = progress;
        progress.playerStatuses.forEach((playerStatus) => {
            for (let i = 0; i < 4; i++) {
                const progressPosition = playerStatus.figures[i];
                this.figures[playerStatus.color][i].setField(progressPosition);
                this.figures[playerStatus.color][i].render();
            }
        });

        if (progress.currentPlayerId === App.getUserInfo().userId) {
            this.boardState = SvgBoardStates.DICE;
            this.overlay.render();
            this.dice.render();
        }
    }
    private init() {
        this.mainFields = [];
        this.background = new StaticBackground(this.draw);

        for (let i = 0; i < 40; i++) {
            this.mainFields[i] = new Field(this.draw, {
                index: i,
                color:
                    i % 10 === 0 ? (`${Math.floor(i / 10)}` as PlayerColor) : null,
                isHome: false,
                isStart: false,
            });
        }

        PlayersOrder.forEach((playerColor) => {
            this.startFields[playerColor] = [];
            this.homeFields[playerColor] = [];
            this.figures[playerColor] = [];

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

                const figure = new Figure(this.draw, playerColor, {
                    index: i,
                    color: playerColor,
                    isHome: false,
                    isStart: true,
                });

                this.homeFields[playerColor].push(homeField);
                this.startFields[playerColor].push(startField);
                this.figures[playerColor].push(figure);
            }
        });
        this.overlay = new Overlay(this.draw);
        this.dicePlayButton = new DicePlayButton(this.draw);
        // kostka musi byt az na konci
        this.dice = new Dice(this.draw);
    }

    private constructPlayerPaths() {
        PlayersOrder.forEach((color: PlayerColor, index: number) => {
            this.paths[color] = [];
            const start = index * 10;

            for (let i = 0; i < 40; i++) {
                const field = this.mainFields[(start + i) % 40];
                this.paths[color].push(field.getFieldInfo());
            }
            for (let i = 0; i < 4; i++) {
                this.paths[color].push(this.homeFields[color][i].getFieldInfo());
            }
        });
    }

    public render() {
        this.background.render();
        for (let i = 0; i < 40; i++) {
            this.mainFields[i].render();
        }
        PlayersOrder.forEach((playerColor) => {
            for (let i = 0; i < 4; i++) {
                this.startFields[playerColor][i].render();
                this.homeFields[playerColor][i].render();
                this.figures[playerColor][i].render();
            }
        });
    }

    public async handleClick(data: DocumentClickData) {
        if (data.dice && this.boardState === SvgBoardStates.DICE) {
            this.boardState = SvgBoardStates.DICE_ANIMATION
            await this.dice.animateDotsSequence(this.gameProgress.lastDiceSequence);
            this.boardState = SvgBoardStates.DICE_PLAY_BTN;
            this.dicePlayButton.render();
            this.dice.animateMoveUp();
            this.dicePlayButton.animateMoveDown();
            return;
        }
        if (data.playButton && this.boardState === SvgBoardStates.DICE_PLAY_BTN) {
            this.boardState = SvgBoardStates.HIGHLIGHT_FIELDS;
            this.dice.clear();
            this.dicePlayButton.clear();
            this.overlay.clear();
            this.showMoveOptions();
            return;
        }
        if (data.field && this.boardState === SvgBoardStates.HIGHLIGHT_FIELDS) {

        }
    }

    private showMoveOptions() {
        const userInfo = App.getUserInfo();
        const move = this.gameProgress.lastDiceSequence[this.gameProgress.lastDiceSequence.length - 1]

        const playerFigures = this.figures[userInfo.color];
        const availableFields = [] as FieldInfo[];
        for (let i = 0; i < 4; i++) {
            const currentField = playerFigures[i].getField()
            let nextField;
            if (currentField.isStart && move === 6) {
                nextField = this.paths[userInfo.color][0]
            } else {
                const currentIndex = 0;
                nextField = this.paths[userInfo.color][0]
            }
            if (nextField && !availableFields.includes(nextField)) {
                const figure = this.getFigureByField(nextField);
                const field = this.getFieldByFieldInfo(nextField)
                console.log(figure);

                if (figure) {
                    figure.highlightAnimationStart();
                } else {
                    field.highlightAnimationStart();
                }
                availableFields.push(nextField);
            }
        }
    }

    private getFigureByField(field: FieldInfo): Figure | null {
        for (let i = 0; i < 4; i++) {
            const color = PlayersOrder[i]
            for (let i = 0; i < 4; i++) {
                const figure = this.figures[color][i]

                if (objectCompare(figure.getField(), field)) {
                    return figure
                }
            }
        }
        return null;
    }

    private getFieldByFieldInfo(field: FieldInfo): Field {
        if (field.isHome) {
            return this.homeFields[field.color][field.index]
        }
        if (field.isStart) {
            return this.startFields[field.color][field.index]
        }
        return this.mainFields[field.index]
    }
}
