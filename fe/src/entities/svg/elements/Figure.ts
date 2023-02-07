import { Runner, Svg } from "@svgdotjs/svg.js";
import { Coordinates, FieldDataset, FigureDataset, PlayerColor } from "../../../types";
import { GameElement } from "../GameElement";
import Consts from "../../../helpers/svgBoardConstants"
import { centers, homeCenters, startCenters } from "../../../helpers/fieldCenters";
import { HasHighlightAnimation } from "../HasHighlightAnimation";
import { Field } from "./Field";
import { HasDataset } from "../../../entities/HasDataset";
import { coordinatesDiff } from "../../../helpers/common";

export class Figure extends GameElement implements HasHighlightAnimation, HasDataset<FigureDataset> {
    private field: Field;
    private nextField = null as Field | null
    private dataset: FigureDataset
    private animationRunners = [] as Runner[]
    private path = null as Field[] | null

    constructor(draw: Svg, info: FigureDataset, field: Field) {
        super(draw)
        this.dataset = info
        this.field = field
        this.svg.setDataset(info)
        this.svg.addClass('figure')

        this.animationRunners[0] = new Runner()
        this.animationRunners[1] = new Runner()
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

    public getDataset() {
        return this.dataset
    }

    public render() {
        this.svg.debug()
        this.clear()
        const color = Consts.COLORS[this.dataset.color]
        const dataset = this.field.getDataset()

        let center
        if (dataset.isHome) {
            center = homeCenters[this.dataset.color][dataset.index]
        } else if (dataset.isStart) {
            center = startCenters[this.dataset.color][dataset.index]
        } else {
            center = centers[dataset.index]
        }

        this.svg.createChild({
            type: 'path',
            path: Consts.FIGURE.RELATIVE_PATH.OUTLINE,
            initialPosition: center,
            color: color.FIGURE_BODY
        })
        this.svg.createChild({
            type: 'path',
            initialPosition: center,
            path: Consts.FIGURE.RELATIVE_PATH.HIGHLIGHT,
            color: color.FIGURE_HIGHLIGHT
        })

        this.svg.setCSS({
            cursor: 'pointer'
        })
    }

    public highlightAnimationStart(): void {
        this.animationRunners[0] = this.svg.getNthChild(1).animate({
            duration: 500,
            delay: 0,
            when: 'now',
            swing: true,
            times: Infinity,
            wait: 200
        }).attr({ fill: Consts.COLORS.HIGHLIGHT.FIGURE_BODY })
        this.animationRunners[1] = this.svg.getNthChild(2).animate({
            duration: 500,
            delay: 0,
            when: 'now',
            swing: true,
            times: Infinity,
            wait: 200
        }).attr({ fill: Consts.COLORS.HIGHLIGHT.FIGURE_BODY })
        this.svg.setCSS({ cursor: 'pointer' })
    }

    public highlightAnimationStop(): void {
        for (let i = 0; i < 2; i++) {
            this.animationRunners[i].loops(2)
            this.animationRunners[i].unschedule()
        }
        this.svg.setCSS({ cursor: 'default' })
    }

    public computeNextField(dice: number): Field | null {
        if (this.path === null) {
            throw new Error("Path not set")
        }
        if (this.field.getDataset().isStart) {
            return dice === 6 ? this.path[0] : null
        }
        const currentIndex = this.path.indexOf(this.field);
        return this.path[currentIndex + dice] || null
    }

    public async animateMoveSequence(finalField: Field): Promise<void> {
        const checkpoints = [] as Field[]
        const finalFieldDataset = finalField.getDataset()

        if (finalFieldDataset.isStart) {
            checkpoints.push(finalField)
        } else {
            const checkpointIndexes = [4, 8, 10, 14, 18, 20, 24, 28, 30, 34, 38, 39]
            const currentFieldIndex = this.path.indexOf(this.field)
            const finalFieldIndex = this.path.indexOf(finalField)
            const filteredCheckpointIndexes = checkpointIndexes
                .filter((index: number): boolean => index < finalFieldIndex && index > currentFieldIndex)

            for (let i = 0; i < filteredCheckpointIndexes.length; i++) {
                const index = filteredCheckpointIndexes[i]
                // console.log(index);
                checkpoints.push(this.path[index])
            }
            checkpoints.push(finalField)
        }

        // console.log(checkpoints)
        for (let i = 0; i < checkpoints.length; i++) {
            await this.moveToField(checkpoints[i])
        }
    }

    public async animateKickSequence(finalField: Field): Promise<void> {
        const index = this.path.indexOf(finalField)
        if (index > 0) {
            await this.animateMoveSequence(this.path[index - 1])
        }

        const sideStepCoordinates = this.getSideStepCenter()
        await this.svg.move({
            duration: 500,
            offset: coordinatesDiff(sideStepCoordinates, this.field.getCoordinates())
        })
        await this.svg.move({
            duration: 500,
            offset: coordinatesDiff(finalField.getCoordinates(), sideStepCoordinates)
        })
        this.field = finalField
    }

    private async moveToField(field: Field) {
        const currentCoordinates = this.field.getCoordinates()
        const nextCoordinates = field.getCoordinates()
        await this.svg.move({
            duration: 500,
            offset: coordinatesDiff(nextCoordinates, currentCoordinates)
        })

        this.field = field
    }

    private getSideStepCenter(): Coordinates {
        const currentCoordinates = this.field.getCoordinates()
        // console.log(this.field)
        switch (this.field.getDataset().index) {
            case 0:
            case 1:
            case 2:
            case 8:
            case 9:
            case 14:
            case 15:
            case 16:
            case 17:
                // return SideStepDirection.UP_RIGHT
                return {
                    x: currentCoordinates.x + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP
                }
            case 4:
            case 5:
            case 6:
            case 7:
            case 30:
            case 31:
            case 32:
            case 38:
            case 39:
                // return SideStepDirection.UP_LEFT
                return {
                    x: currentCoordinates.x - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP
                }
            case 10:
            case 11:
            case 12:
            case 18:
            case 19:
            case 24:
            case 25:
            case 26:
            case 27:
                // return SideStepDirection.DOWN_RIGHT
                return {
                    x: currentCoordinates.x + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP
                }
            case 20:
            case 21:
            case 22:
            case 28:
            case 29:
            case 34:
            case 35:
            case 36:
            case 37:
                // return SideStepDirection.DOWN_LEFT
                return {
                    x: currentCoordinates.x - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP
                }
            case 3:
                // return SideStepDirection.UP
                return {
                    x: currentCoordinates.x,
                    y: currentCoordinates.y - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP
                }
            case 13:
                // return SideStepDirection.RIGHT
                return {
                    x: currentCoordinates.x + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y
                }
            case 23:
                // return SideStepDirection.DOWN
                return {
                    x: currentCoordinates.x,
                    y: currentCoordinates.y + Consts.BOARD.FIELDS.OUTER_SIZE + Consts.BOARD.FIELDS.GAP
                }
            case 33:
                // return SideStepDirection.LEFT
                return {
                    x: currentCoordinates.x - Consts.BOARD.FIELDS.OUTER_SIZE - Consts.BOARD.FIELDS.GAP,
                    y: currentCoordinates.y
                }
        }
    }
}
