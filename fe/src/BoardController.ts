import {Svg} from "@svgdotjs/svg.js";
import {centers, homeCenters} from "./helpers/fieldCenters";
import {Field} from "./svgElements/Field";
import {Figure} from "./svgElements/Figure";
import {StaticBackground} from "./svgElements/StaticBackground";
import {
    FieldDataset,
    PlayersOrder,
    PlayerColor,
    SvgBoardStates,
    GameProgress,
    PlayerColors,
    DocumentClickData, GameProgressUpdate,
} from "./types";
import App from "./App";
import {Dice} from "./svgElements/Dice";
import {Overlay} from "./svgElements/Overlay";
import {DicePlayButton} from "./svgElements/DicePlayButton";
import {objectCompare} from "./helpers/common";
import {SocketIOClientInstance} from "./socketio/SocketClient";
import svgBoardConstants from "./helpers/svgBoardConstants";
import {NoMovesModal} from "./svgElements/NoMovesModal";
import {NextPlayerButton} from "./svgElements/NextPlayerButton";

export class BoardController {
    private readonly draw: Svg;
    private boardState: SvgBoardStates;
    private gameProgress: GameProgress;
    private background: StaticBackground;
    private overlay: Overlay;
    private dicePlayButton: DicePlayButton;
    private dice: Dice;
    private noMovesModal: NoMovesModal;
    private nextPlayerButton: NextPlayerButton;
    private mainFields = [] as Field[];
    private homeFields = {} as Record<PlayerColor, Field[]>;
    private startFields = {} as Record<PlayerColor, Field[]>;
    private figures = {} as Record<PlayerColor, Figure[]>;

    constructor(draw: Svg) {
        this.draw = draw;
        this.boardState = SvgBoardStates.BEFORE_LOAD;
        this.init();
    }

    public setProgress(progress: GameProgress) {
        this.gameProgress = progress
    }

    public updateGameProgress(progress: GameProgress) {
        this.gameProgress = progress;
        Object.keys(progress.playerStatuses).forEach((playerColor: PlayerColor) => {
            for (let i = 0; i < 4; i++) {
                const progressPosition = progress.playerStatuses[playerColor].figures[i];
                const field = this.getFieldByFieldDataset(progressPosition)
                this.figures[playerColor][i].setField(field);
                this.figures[playerColor][i].render();
            }
        });
        this.displayDice()
    }

    private displayDice() {
        if (this.gameProgress.currentPlayerId === App.getUserInfo().userId) {
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

        PlayersOrder.forEach((playerColor, index) => {
            const path = [] as Field[]
            const pathStart = index * 10;
            for (let i = 0; i < 40; i++) {
                const field = this.mainFields[(pathStart + i) % 40];
                path.push(field);
            }

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

                this.homeFields[playerColor].push(homeField);
                this.startFields[playerColor].push(startField);
                path.push(startField)
            }

            for (let i = 0; i < 4; i++) {
                const figure = new Figure(this.draw, {color: playerColor, index: i}, this.startFields[playerColor][i]);
                figure.setPath(path)
                this.figures[playerColor].push(figure);
            }
        });
        this.overlay = new Overlay(this.draw);
        this.dicePlayButton = new DicePlayButton(this.draw);
        this.noMovesModal = new NoMovesModal(this.draw)
        this.nextPlayerButton = new NextPlayerButton(this.draw)
        // kostka musi byt az na konci
        this.dice = new Dice(this.draw);
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
        console.log(data)
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
            const field = this.getFieldByFieldDataset(data.field)
            const srcFigure = this.getFigureByField(field, true)
            if (srcFigure) {
                this.stopAllHighlightAnimations()
                const update: GameProgressUpdate = {
                    type: "MOVE",
                    prevField: srcFigure.getField().getDataset(),
                    nextField: field.getDataset()
                }
                SocketIOClientInstance.socket.emit("CLIENT_GAME_PROGRESS_UPDATE", [update])
                await srcFigure.animateMoveSequence(field)
            }
        }
        if (this.boardState === SvgBoardStates.NO_MOVES && data.nextPlayerButton) {
            SocketIOClientInstance.socket.emit("CLIENT_GAME_PROGRESS_UPDATE", [])
        }

    }

    private showMoveOptions() {
        const userInfo = App.getUserInfo();
        const move = this.gameProgress.lastDiceSequence[this.gameProgress.lastDiceSequence.length - 1]

        const playerFigures = this.figures[userInfo.color];
        const availableFields = [] as Field[];
        for (let i = 0; i < 4; i++) {
            const currentFigure = playerFigures[i]
            const nextField = currentFigure.computeNextField(move)
            if (nextField && !availableFields.includes(nextField)) {
                const figure = this.getFigureByField(nextField);
                console.log(figure);

                if (figure) {
                    figure.highlightAnimationStart();
                } else {
                    nextField.highlightAnimationStart();
                }
                availableFields.push(nextField);
                currentFigure.setNextField(nextField)
            } else {
                currentFigure.setField(null)
            }
        }
        if (!availableFields.length) {
            this.boardState = SvgBoardStates.NO_MOVES
            this.overlay.render()
            this.noMovesModal.render()
            this.nextPlayerButton.render()
            this.noMovesModal.moveDown()
            this.nextPlayerButton.moveDown()
        }
    }

    public async animateUpdates(updates: GameProgressUpdate[]) {
        this.boardState = SvgBoardStates.GAME_PROGRESS_UPDATE_MOVE
        for (const update of updates) {
            if (update.type === "MOVE") {
                const prevField = this.getFieldByFieldDataset(update.prevField)
                const nextField = this.getFieldByFieldDataset(update.nextField)
                const figure = this.getFigureByField(prevField)
                await figure.animateMoveSequence(nextField)
                console.log(figure)
            }
        }
        this.displayDice()
    }

    private getFigureByField(field: Field, next: boolean = false): Figure | null {
        // TODO predelat
        for (let i = 0; i < 4; i++) {
            const color = PlayersOrder[i]
            for (let i = 0; i < 4; i++) {
                const figure = this.figures[color][i]
                if (!next && figure.getField() === field) {
                    return figure
                }
                if (next && figure.getNextField() === field) {
                    return figure
                }
            }
        }
        return null;
    }

    private getFieldByFieldDataset(field: FieldDataset): Field {
        if (field.isHome) {
            return this.homeFields[field.color][field.index]
        }
        if (field.isStart) {
            return this.startFields[field.color][field.index]
        }
        return this.mainFields[field.index]
    }

    private stopAllHighlightAnimations() {
        for (let i = 0; i < 40; i++) {
            this.mainFields[i].highlightAnimationStop()
        }

        PlayersOrder.forEach(playerColor => {
            for (let i = 0; i < 4; i++) {
                this.homeFields[playerColor][i].highlightAnimationStop()
                this.startFields[playerColor][i].highlightAnimationStop()
                this.figures[playerColor][i].highlightAnimationStop()
            }
        })
    }
}
