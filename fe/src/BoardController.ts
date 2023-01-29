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
    DocumentClickData
} from "./types";
import App from "./App";
import {Dice} from "./svgElements/Dice";
import {Overlay} from "./svgElements/Overlay";
import {DicePlayButton} from "./svgElements/DicePlayButton";

export class BoardController {
    private readonly draw: Svg;
    private boardState: SvgBoardStates;
    private gameProgress: GameProgress
    private background: StaticBackground;
    private overlay: Overlay;
    private dicePlayButton: DicePlayButton;
    private dice: Dice;
    private mainFields = [] as Field[];
    private homeFields = {} as Record<PlayerColor, Field[]>;
    private startFields = {} as Record<PlayerColor, Field[]>;
    private figures =  {} as Record<PlayerColor, Figure[]>;
    private paths: Record<PlayerColor, Field[]>
    constructor(draw: Svg) {
        this.draw = draw
        this.boardState = SvgBoardStates.BEFORE_LOAD
        this.init()
    }
    public updateGameProgress(progress: GameProgress) {
        this.gameProgress = progress
        progress.playerStatuses.forEach(playerStatus => {
            for (let i = 0; i < 4; i++) {
                const progressPosition = playerStatus.figures[i]
                this.figures[playerStatus.color][i].setField(progressPosition)
                this.figures[playerStatus.color][i].render()
            }
        })

        if (progress.currentPlayerId === App.getUserInfo().userId ) {
            this.boardState = SvgBoardStates.DICE
            this.overlay.render()
            this.dice.render()
        }
    }
    private init() {
        this.mainFields = [];
        this.background = new StaticBackground(this.draw);

        for (let i = 0; i < 40; i++) {
            this.mainFields[i] = new Field(this.draw, {
                index: i,
                playerColor: i % 10 === 0 ? `${Math.floor(i / 10)}` as PlayerColor : null,
                isHome: false,
                isStart: false
            })
        }

        PlayersOrder.forEach(playerColor => {
            this.startFields[playerColor] = []
            this.homeFields[playerColor] = []
            this.figures[playerColor] = []

            for (let i = 0; i < 4; i++) {
                const homeField = new Field(this.draw, {
                    index: i,
                    playerColor: playerColor,
                    isHome: true,
                    isStart: false
                })
                const startField = new Field(this.draw, {
                    index: i,
                    playerColor: playerColor,
                    isHome: false,
                    isStart: true
                })

                const figure = new Figure(this.draw, playerColor, {
                    index: i,
                    playerColor: playerColor,
                    isHome: false,
                    isStart: true
                })

                this.homeFields[playerColor].push(homeField)
                this.startFields[playerColor].push(startField)
                this.figures[playerColor].push(figure)
            }
        })
        this.overlay = new Overlay(this.draw)
        this.dicePlayButton = new DicePlayButton(this.draw)
        // kostka musi byt az na konci
        this.dice = new Dice(this.draw)
    }

    private constructPlayerPaths () {
        PlayersOrder.forEach((color: PlayerColor, index: number) => {
            this.paths[color] = []
            const start = index * 10

            for (let i = 0; i < 40; i++) {
                this.paths[color].push()
            }
        })
    }

    public render () {
        this.background.render();
        for (let i = 0; i < 40; i++) {
            this.mainFields[i].render()
        }
        PlayersOrder.forEach(playerColor => {
            for (let i = 0; i < 4; i++) {
                this.startFields[playerColor][i].render()
                this.homeFields[playerColor][i].render()
                this.figures[playerColor][i].render()
            }
        })
    }

    public async handleClick (data: DocumentClickData) {
        if (data.dice && this.boardState === SvgBoardStates.DICE) {
            await this.dice.animateDotsSequence(this.gameProgress.lastDiceSequence)
            this.boardState = SvgBoardStates.DICE_PLAY_BTN
            this.dicePlayButton.render()
            this.dice.animateMoveUp()
            this.dicePlayButton.animateMoveDown()
            return
        }
        if (data.playButton) {
            this.boardState = SvgBoardStates.HIGHLIGHT_FIELDS
            this.dice.clear()
            this.dicePlayButton.clear()
            this.overlay.clear()
            return
        }

    }
}
