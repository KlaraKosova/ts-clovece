import { Runner, Svg } from "@svgdotjs/svg.js";
import { Coordinates, FieldDataset, FigureDataset, PlayerColor } from "../types";
import { GameElement } from "./GameElement";
import Consts from "../helpers/svgBoardConstants"
import { centers, homeCenters, startCenters } from "../helpers/fieldCenters";
import { HasHighlightAnimation } from "./HasHighlightAnimation";
import { Field } from "./Field";

export class Figure extends GameElement implements HasHighlightAnimation {
    private field: Field;
    private nextField = null as Field | null
    private figureDataset: FigureDataset
    private animationRunners = [] as Runner[]
    private path = null as Field[] | null
    constructor(draw: Svg, info: FigureDataset, field: Field) {
        super(draw)
        this.figureDataset = info
        this.field = field
        this.svg.setDataset(info)
        this.svg.addClass('figure')

        for (let i = 0; i < 4; i++) {
            this.animationRunners[i] = new Runner()
        }
    }

    public setPath(path: Field[]) {
        this.path = path
    }
    public setField(field: Field) {
        this.field = field
    }

    public getField() {
        return this.field
    }

    public getNextField() {
        return this.nextField
    }

    public setNextField(field: Field | null) {
        this.nextField = field
    }

    public render() {
        this.clear()
        const color = Consts.COLORS[this.figureDataset.color]
        const dataset = this.field.getFieldDataset()

        let center
        if (dataset.isHome) {
            center = homeCenters[this.figureDataset.color][dataset.index]
        } else if (dataset.isStart) {
            center = startCenters[this.figureDataset.color][dataset.index]
        } else {
            center = centers[dataset.index]
        }

        this.svg.createChild({
            type: 'circle',
            diameter: 22,
            color: color.front,
            center: { x: center.x + 1, y: center.y + 1 }
        })
        this.svg.createChild({
            type: 'circle',
            diameter: 20,
            color: color.shadow,
            center
        })
        this.svg.createChild({
            type: 'circle',
            diameter: 11,
            color: color.front,
            center: { x: center.x + 1, y: center.y + 1 }
        })
        this.svg.createChild({
            type: 'circle',
            diameter: 11,
            color: color.highlight,
            center
        })

        this.svg.setCSS({
            cursor: 'pointer'
        })
    }

    public highlightAnimationStart(): void {
        const colors = [Consts.COLORS.HIGHLIGHT.highlight, Consts.COLORS.HIGHLIGHT.front, Consts.COLORS.HIGHLIGHT.back, Consts.COLORS.HIGHLIGHT.shadow]
        for (let i = 0; i < 4; i++) {
            this.animationRunners[i] = this.svg.getNthChild(i + 1).animate({
                duration: 500,
                delay: 0,
                when: 'now',
                swing: true,
                times: Infinity,
                wait: 200
            }).attr({ fill: colors[i] })
            this.svg.setCSS({ cursor: 'pointer' })
        }

    }

    public highlightAnimationStop(): void {
        for (let i = 0; i < 4; i++) {
            this.animationRunners[i].loops(2)
            this.animationRunners[i].unschedule()
        }
        this.svg.setCSS({ cursor: 'default' })
    }

    public computeNextField(dice: number): Field | undefined {
        if (this.path === null) {
            throw new Error("Path not set")
        }
        if (this.field.getFieldDataset().isStart && dice === 6) {
            return this.path[0]
        }
        const currentIndex = this.path.indexOf(this.field);
        return this.path[currentIndex + dice]
    }

    public async animateMoveSequence(finalField: Field): Promise<void> {
        const checkpoints = [] as Coordinates[]
        let destFieldCoordinates: Coordinates

        const finalFieldDataset = finalField.getFieldDataset()

        if (finalFieldDataset.isStart) {
            checkpoints.push(finalField.getCoordinates())
        } else {
            const checkpointIndexes = [4, 8, 10, 14, 18, 20, 24, 28, 30, 34, 38, 39]
            const fieldIndex = this.path.indexOf(this.field)
            const finalFieldIndex = this.path.indexOf(finalField)
            /* while (checkpointIndexes[0] < fieldIndex) {
                // rotate left
                checkpointIndexes.push(checkpointIndexes.shift()!)
            } */

            const filteredCheckpointIndexes = checkpointIndexes
                .filter((index: number): boolean => index < finalFieldIndex)

            for (let i = 0; i < filteredCheckpointIndexes.length; i++) {
                const index = filteredCheckpointIndexes[i]
                console.log(index);

                checkpoints.push(this.path[index].getCoordinates())
            }
            checkpoints.push(finalField.getCoordinates())
        }

        console.log(checkpoints)
        for (const checkpoint of checkpoints) {
            await this.svg.move({
                duration: 500,
                center: checkpoint
            })
        }

        //        this.field = finalField
    }
}
