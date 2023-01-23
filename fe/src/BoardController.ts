import { Svg } from "@svgdotjs/svg.js";
import { centers, homeCenters } from "./helpers/fieldCenters";
import { Field } from "./svgElements/Field";
import { Figure } from "./svgElements/Figure";
import { StaticBackground } from "./svgElements/StaticBackground";
import { FieldInfo, PlayersOrder, PlayerIndex, SvgBoardStates, GameProgress, PlayerColors } from "./types";

export class BoardController {
    private draw: Svg;
    private boardState: SvgBoardStates;
    private gameProgress: GameProgress
    private background: StaticBackground;
    private mainFields = [] as Field[];
    private homeFields = [] as Field[];
    private startFields = [] as Field[];
    private figurePositions =  {} as Record<PlayerIndex, Figure[]>
    constructor(draw: Svg) {
        this.draw = draw
        this.boardState = SvgBoardStates.DEFAULT
    }
    public setGameProgress(progress: GameProgress) {
        this.gameProgress = progress
        /* PlayersOrder.forEach(playerIndex => {
            for (let i = 0; i < 4; i++) {
                this.figurePositions[playerIndex][i].setField(progress.playerStatuses[playerIndex].figures[i])
            }
        }) */
    }
    public init() {
        this.mainFields = [];
        this.homeFields = [];
        this.startFields = [];
        this.background = new StaticBackground(this.draw);
        this.background.render();

        for (let i = 0; i < 40; i++) {
            this.mainFields[i] = new Field(this.draw, {
                index: i,
                playerIndex: i % 10 === 0 ? `${Math.floor(i / 10)}` as PlayerIndex : null,
                isHome: false,
                isStart: false
            })
            this.mainFields[i].render()
        }

        PlayersOrder.forEach(playerIndex => {
            for (let i = 0; i < 4; i++) {
                const homeField = new Field(this.draw, {
                    index: i,
                    playerIndex: playerIndex,
                    isHome: true,
                    isStart: false
                })
                const startField = new Field(this.draw, {
                    index: i,
                    playerIndex: playerIndex,
                    isHome: false,
                    isStart: true
                })

                startField.render()
                homeField.render()

                this.homeFields.push(homeField)
                this.startFields.push(startField)

                this.figurePositions[playerIndex] = []
                // TODO refactor this
                for (let i = 0; i < 4; i++) {
                    const figure = new Figure(this.draw, playerIndex, {
                        index: i,
                        playerIndex: playerIndex,
                        isHome: false,
                        isStart: true
                    })
                    figure.render()
                    this.figurePositions[playerIndex].push(figure)
                }
            }
        })
    }

    public render () {
        PlayersOrder.forEach(playerIndex => {
            for (let i = 0; i < 4; i++) {
                this.figurePositions[playerIndex][i].render()
            }
        })
    }
}