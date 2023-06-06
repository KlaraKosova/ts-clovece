import {HasDataset} from "@/facades/HasDataset";
import {GameProgressDataset} from "@/types/data/GameProgressDataset";
import cloneDeep from "lodash/cloneDeep";
import {FieldDataset} from "@/types/data/FieldDataset";
import {FigureDataset} from "@/types/data/FigureDataset";
import {PlayerColors, PlayersOrder} from "@/types/common/PlayerColors";
import {Field} from "@/gameProgressControls/logicLayer/Field";
import {Figure} from "@/gameProgressControls/logicLayer/Figure";
import {UserInfo} from "@/types/common/UserInfo";
import {objectCompare} from "@/utils/common";

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
                this.figures[playerColor][i].setField(this.startFields[playerColor][i])
                this.figures[playerColor][i].setPath(path)
            }
        });
    }
    public setDataset(dataset: GameProgressDataset) {
        this.dataset = cloneDeep(dataset)
    }

    public getDataset(): GameProgressDataset {
        return
    }

    public getCurrentPlayerId() {
        return this.dataset.currentPlayerId
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
            figures: [] as FigureDataset[]
        }

        const diceResult = this.getDiceResult()
        const playerFigures = this.figures[this.user.color]

        for (let i = 0; i < 4; i++) {
            const currentFigure = playerFigures[i]
            const nextField: FieldDataset | null = currentFigure.computeNextField(diceResult)

            const alreadyIncluded = result.fields.find(f => objectCompare(f, nextField))
            if (nextField && !alreadyIncluded) {
                result.fields.push(nextField)

                const figure = this.getFigureByField(nextField)
                if (figure) {
                    result.figures.push(figure.getDataset())
                }
            }
        }

        return result
    }

    private getFigureByField(field: FieldDataset): Figure | null {
        PlayersOrder.forEach((playerColor, index) => {
            for (let i = 0; i < 4; i++) {
                const figure = this.figures[playerColor][i]

                if (objectCompare(figure.getField().getDataset(), field)) {
                    return figure
                }
            }
        })

        return null
    }
}