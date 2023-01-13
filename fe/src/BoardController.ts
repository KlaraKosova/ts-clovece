import { Svg } from "@svgdotjs/svg.js";
import { centers, homeCenters } from "./helpers/fieldCenters";
import { Field } from "./svgElements/Field";
import { StaticBackground } from "./svgElements/StaticBackground";
import { PlayerColors, PlayerIndex } from "./types";

export class BoardController {
    private draw: Svg;
    private background: StaticBackground;
    private mainFields = [] as Field[];
    private homeFields = [] as Field[];
    private startFields = [] as Field[];
    constructor(draw: Svg) {
        this.draw = draw
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

        Object.values(PlayerColors).forEach(playerIndex => {
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
            }
        })
    }
}