import {GameProgressDataset} from "@/types/data/GameProgressDataset";
import cloneDeep from "lodash/cloneDeep";
import {FieldDataset} from "@/types/data/FieldDataset";
import {FigureDataset} from "@/types/data/FigureDataset";
import {PlayerColors, PlayersOrder} from "@/types/common/PlayerColors";
import {Field} from "@/gameProgressControls/logicLayer/Field";
import {Figure} from "@/gameProgressControls/logicLayer/Figure";
import {UserInfo} from "@/types/common/UserInfo";
import {objectCompare} from "@/utils/common";
import { GameProgressUpdate } from "@/types/data/GameProgressUpdate";
import { HasDataset } from "./HasDataset";
import { defaultGameProgressDataset } from "@/utils/constants";

export class LogicLayer implements HasDataset<GameProgressDataset>{
    private dataset: GameProgressDataset
    private user: UserInfo
    private mainFields: Field[]
    private startFields: Record<PlayerColors, Field[]>
    private homeFields: Record<PlayerColors, Field[]>
    private figures: Record<PlayerColors, Figure[]>

    public constructor(user: UserInfo) {
        this.user = user

        this.startFields = {} as Record<PlayerColors, Field[]>
        this.homeFields = {} as Record<PlayerColors, Field[]>
        this.figures = {} as Record<PlayerColors, Figure[]>
        this.mainFields = [] as Field[]

        for (let i = 0; i < 40; i++) {
            this.mainFields[i] = new Field()
            this.mainFields[i].setDataset({
                index: i,
                color:
                    i % 10 === 0 ? (`${Math.floor(i / 10)}` as PlayerColors) : null,
                isHome: false,
                isStart: false,
            })
        }

        PlayersOrder.forEach((playerColor, index) => {
            const path = [] as FieldDataset[]
            const pathStart = index * 10
            for (let i = 0; i < 40; i++) {
                const field = this.mainFields[(pathStart + i) % 40]
                path.push(field.getDataset())
            }

            this.startFields[playerColor] = []
            this.homeFields[playerColor] = []
            this.figures[playerColor] = []

            for (let i = 0; i < 4; i++) {
                this.homeFields[playerColor][i] = new Field()
                this.homeFields[playerColor][i].setDataset({
                    index: i,
                    color: playerColor,
                    isHome: true,
                    isStart: false,
                })

                this.startFields[playerColor][i] = new Field()
                this.startFields[playerColor][i].setDataset({
                    index: i,
                    color: playerColor,
                    isHome: false,
                    isStart: true,
                })

                path.push({
                    index: i,
                    color: playerColor,
                    isHome: true,
                    isStart: false,
                })
            }

            for (let i = 0; i < 4; i++) {
                this.figures[playerColor][i] = new Figure()
                this.figures[playerColor][i].setDataset({ color: playerColor, index: i })
                this.figures[playerColor][i].setField(this.startFields[playerColor][i].getDataset())
                this.figures[playerColor][i].setPath(path)
            }
        });

        this.setDataset(defaultGameProgressDataset)
    }
    public setDataset(dataset: GameProgressDataset) {
        this.dataset = cloneDeep(dataset)

        PlayersOrder.forEach((playerColor, index) => {
            for (let i = 0; i < 4; i++) {
                this.figures[playerColor][i].setField(this.dataset.playerStatuses[playerColor].figures[i])
            }
        });
    }

    public getDataset(): GameProgressDataset {
        return cloneDeep(this.dataset)
    }

    public getCurrentPlayerId() {
        return this.dataset.currentPlayerId
    }

    public getPlayerColorById(id: string) {
        for (const color of PlayersOrder) {
            if (this.dataset.playerStatuses[color].userId === id) {
                return color
            }
        }

        throw new Error("Player ID doesn't exist")
    }

    public getDiceSequence() {
        return [...this.dataset.lastDiceSequence]
    }

    public getDiceResult() {
        return this.dataset.lastDiceSequence[this.dataset.lastDiceSequence.length - 1]
    }

    public getAvailable() {
        const result = {
            fields: [] as FieldDataset[],
            figures: [] as FigureDataset[],
            homeMovesOnly: true
        }

        const diceResult = this.getDiceResult()
        const playerFigures = this.figures[this.user.color]

        for (let i = 0; i < 4; i++) {
            const currentFigure = playerFigures[i]
            const nextField: FieldDataset | null = currentFigure.computeNextField(diceResult)

            const alreadyIncluded = result.fields.find(f => objectCompare(f, nextField))
            if (nextField && !alreadyIncluded) {

                const figure = this.getFigureByFieldDataset(nextField)
                if (nextField.isHome && !figure) {
                    // figurky v domecku by se nemely dat vyhodit ani figurkami stejne barvy
                    result.fields.push(nextField)
                }

                /* 
                // do nothing
                if (nextField.isHome && figure) {
                    
                }
                */

                if (!nextField.isHome) {
                    result.fields.push(nextField)

                    if (figure) {
                        result.figures.push(figure.getDataset())
                    }
                }

                if (!nextField.isHome || !currentFigure.getField().isHome ) {
                    result.homeMovesOnly = false
                }
            }
        }

        return result
    }

    public getUpdates(data: { field: FieldDataset | null, figure: FigureDataset | null }): GameProgressUpdate[] {
        const result = [] as GameProgressUpdate[]

        let destFieldDataset: FieldDataset
        let srcFigure = null as Figure | null
        let destFigure = null as Figure | null

        if (data.field) {
            destFieldDataset = data.field
            srcFigure = this.getFigureByNextFieldDataset(data.field)
            destFigure = this.getFigureByFieldDataset(data.field)
        } else {
            destFigure = this.getFigureByFigureDataset(data.figure)
            destFieldDataset = destFigure.getField()
            srcFigure = this.getFigureByNextFieldDataset(destFieldDataset)
        }

        if (!srcFigure) {
            throw new Error("should not happen")
        }

        if (destFigure) {
            const startField = this.getFreeStartField(destFigure.getDataset().color)
            result.push({
                type: "KICK",
                prevField: srcFigure.getField(),
                nextField: destFieldDataset,
                figure: srcFigure.getDataset()
            })


            result.push({
                type: "MOVE",
                prevField: destFigure.getField(),
                nextField: startField.getDataset(),
                figure: destFigure.getDataset()
            })

            srcFigure.setField(destFieldDataset)
            destFigure.setField(startField.getDataset())
        } else {
            result.push({
                type: "MOVE",
                prevField: srcFigure.getField(),
                nextField: destFieldDataset,
                figure: srcFigure.getDataset()
            })

            srcFigure.setField(destFieldDataset)
        }

        return result
    }

    private getFigureByFieldDataset(field: FieldDataset): Figure | null {        
        for (const playerColor of PlayersOrder) {
            for (let i = 0; i < 4; i++) {
                const figure = this.figures[playerColor][i]
                
                if (objectCompare(figure.getField(), field)) {
                    return figure
                }
            }
        }

        return null
    }

    private getFigureByNextFieldDataset(field: FieldDataset): Figure | null {
        const diceResult = this.getDiceResult()        
        for (const playerColor of PlayersOrder) {
            for (let i = 0; i < 4; i++) {
                const figure = this.figures[playerColor][i]
                
                if (objectCompare(figure.computeNextField(diceResult), field)) {
                    return figure
                }
            }
        }

        return null
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

    private getFigureByFigureDataset(figure: FigureDataset): Figure {
        return this.figures[figure.color][figure.index]
    }

    private getFreeStartField(color: PlayerColors) {
        // TODO refactor this
        const startFields = [...this.startFields[color]] as (Field | null)[]

        for (let i = 0; i < 4; i++) {
            const figure = this.figures[color][i]
            // console.log('+++++++++++++++++++++++', i);

            for (let j = 0; j < 4; j++) {
                if (!startFields[j]) {
                    continue
                }
                const figureFieldDataset = figure.getField()
                const startFieldDataset = startFields[j].getDataset()
                // console.log('------------');
                // console.log(figureFieldDataset);

                // console.log(startFieldDataset);
                // console.log('/************   ', objectCompare(figureFieldDataset, startFieldDataset), '   ************/');


                if (objectCompare(figureFieldDataset, startFieldDataset)) {
                    startFields[j] = null
                }
            }
            // console.log(startFields);
        }

        return startFields[0] || startFields[1] || startFields[2] || startFields[3]
    }
}