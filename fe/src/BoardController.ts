import {Svg} from "@svgdotjs/svg.js";
import {centers, homeCenters} from "./helpers/fieldCenters";
import {Field} from "./svg/elements/Field";
import {Figure} from "./svg/elements/Figure";
import {StaticBackground} from "./svg/elements/StaticBackground";
import {
    FieldDataset,
    PlayersOrder,
    PlayerColor,
    SvgBoardStates,
    GameProgress,
    PlayerColors,
    DocumentClickData, GameProgressUpdate, FigureDataset,
} from "./types";
import App from "./App";
import {Dice} from "./svg/elements/Dice";
import {Overlay} from "./svg/elements/Overlay";
import {DicePlayButton} from "./svg/elements/DicePlayButton";
import {objectCompare} from "./helpers/common";
import {SocketIOClientInstance} from "./socketio/SocketClient";
import svgBoardConstants from "./helpers/svgBoardConstants";
import {NoMovesModal} from "./svg/elements/NoMovesModal";
import {NextPlayerButton} from "./svg/elements/NextPlayerButton";
import {Loading} from "./svg/elements/Loading";

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
    private loading: Loading;
    private mainFields = [] as Field[];
    private homeFields = {} as Record<PlayerColor, Field[]>;
    private startFields = {} as Record<PlayerColor, Field[]>;
    private figures = {} as Record<PlayerColor, Figure[]>;

    constructor(draw: Svg) {
        this.draw = draw;
        this.boardState = SvgBoardStates.LOADING;
        this.init();
    }

    public setProgress(progress: GameProgress) {
        if (this.boardState === SvgBoardStates.NO_MOVES_MODAL) {
            this.overlay.clear()
            this.noMovesModal.clear()
            this.nextPlayerButton.clear()
        }
        this.gameProgress = progress
    }

    public updateGameProgress(progress: GameProgress) {
        this.overlay.clear()
        this.loading.clear()

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
        this.loading = new Loading(this.draw)
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
        this.overlay.render()
        this.loading.render()
        this.loading.runAnimation()
    }

    public async handleClick(data: DocumentClickData) {
        // console.log(data)
        if (data.dice && this.boardState === SvgBoardStates.DICE) {
            this.boardState = SvgBoardStates.DICE_ANIMATION
            await this.dice.animateDotsSequence(this.gameProgress.lastDiceSequence);
            this.boardState = SvgBoardStates.DICE_PLAY_BUTTON;
            this.dicePlayButton.render();
            this.dice.animateMoveUp();
            this.dicePlayButton.animateMoveDown();
            return;
        }
        if (data.playButton && this.boardState === SvgBoardStates.DICE_PLAY_BUTTON) {
            this.boardState = SvgBoardStates.HIGHLIGHT_ANIMATION;
            this.dice.clear();
            this.dicePlayButton.clear();
            this.overlay.clear();
            this.showMoveOptions();
            return;
        }

        if ( this.boardState === SvgBoardStates.HIGHLIGHT_ANIMATION && (data.field || data.figure)) {
            this.boardState = SvgBoardStates.CURRENT_PLAYER_FIGURE_MOVE_ANIMATION
            let field
            let srcFigure : Figure | null
            let destFigure : Figure | null

            if (data.field) {
                field = this.getFieldByFieldDataset(data.field)
                srcFigure = this.getFigureByField(field, true)
                destFigure = this.getFigureByField(field, false)
            } else {
                destFigure = this.getFigureByFigureDataset(data.figure)
                field = destFigure.getField()
                srcFigure = this.getFigureByField(field, true)
            }
            if (!srcFigure) {
                return
            }

            this.stopAllHighlightAnimations()
            const updates: GameProgressUpdate[] = []

            if (destFigure) {
                const startField = this.getFreeHomeField(destFigure.getDataset().color)
                updates.push({
                    type: "MOVE",
                    prevField: srcFigure.getField().getDataset(),
                    nextField: field.getDataset()
                })

                updates.push({
                    type: "KICK",
                    prevField: destFigure.getField().getDataset(),
                    nextField: startField.getDataset()
                })
                console.log('updates', updates)
                SocketIOClientInstance.socket.emit("CLIENT_GAME_PROGRESS_UPDATE", updates)

                await srcFigure.animateKickSequence(field)
                await destFigure.animateMoveSequence(startField)
            } else {
                updates.push({
                    type: "MOVE",
                    prevField: srcFigure.getField().getDataset(),
                    nextField: field.getDataset()
                })
                SocketIOClientInstance.socket.emit("CLIENT_GAME_PROGRESS_UPDATE", updates)
                await srcFigure.animateMoveSequence(field)
            }

        }

        if (this.boardState === SvgBoardStates.NO_MOVES_MODAL && data.nextPlayerButton) {
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
                if (figure) {
                    figure.highlightAnimationStart();
                }
                nextField.highlightAnimationStart();
                availableFields.push(nextField);
                currentFigure.setNextField(nextField)
            }
        }
        if (!availableFields.length) {
            this.boardState = SvgBoardStates.NO_MOVES_MODAL
            this.overlay.render()
            this.noMovesModal.render()
            this.nextPlayerButton.render()
            this.noMovesModal.moveDown()
            this.nextPlayerButton.moveDown()
        }
    }

    public async animateUpdates(updates: GameProgressUpdate[]) {
        if (this.boardState === SvgBoardStates.CURRENT_PLAYER_FIGURE_MOVE_ANIMATION) {
            this.displayDice()
            return
        }
        this.boardState = SvgBoardStates.NEXT_PLAYER_FIGURE_MOVE_ANIMATION
        const animationFunctions = [] // as ((field: Field) => Promise<void>)[]
        for (const update of updates) {
            const prevField = this.getFieldByFieldDataset(update.prevField)
            const nextField = this.getFieldByFieldDataset(update.nextField)
            const prevFigure = this.getFigureByField(prevField)
            const nextFigure = this.getFigureByField(nextField)
            if (update.type === "MOVE") {
                // await prevFigure.animateMoveSequence(nextField)
                // animationFunctions.push(prevFigure.animateMoveSequence.bind(prevFigure, nextField))
                animationFunctions.push(bind(prevFigure.animateMoveSequence, prevFigure, nextField))
            } else if(update.type === 'KICK') {
                await prevFigure.animateKickSequence(nextField)
                if (!nextFigure) {
                    throw new Error('test')
                }
                // await nextFigure.animateMoveSequence(nextField)
                // animationFunctions.push(nextFigure.animateMoveSequence.bind(nextFigure, nextField))
                animationFunctions.push(bind(nextFigure.animateMoveSequence, nextFigure, nextField))
            }
        }
        for (const animationFunction of animationFunctions) {
            console.log(animationFunction.__boundThis__)
            console.log(animationFunction.__boundArgs__)
            console.log('--------')
            animationFunction()
        }
        this.displayDice()
    }

    private getFigureByField(field: Field, next: boolean = false): Figure | null {
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

    private getFigureByFigureDataset(figure: FigureDataset) {
        return this.figures[figure.color][figure.index]
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

    private getFreeHomeField (color: PlayerColor) {
        const startFields = [ ...this.startFields[color] ] as (Field | null)[]

        for (let i = 0; i < 4; i++) {
            const figure = this.figures[color][i]
            const index = startFields.indexOf(figure.getField())
            if (index !== -1) {
                startFields[i] = null
            }
        }

        return startFields[0] || startFields[1] || startFields[2] || startFields[3]
    }
}

// @ts-ignore
function bind(fn, boundThis, ...args) {
    const bound = fn.bind(boundThis, ...args)
    bound.__targetFunction__ = fn;
    bound.__boundThis__ = boundThis;
    bound.__boundArgs__ = args
    return bound;
}
