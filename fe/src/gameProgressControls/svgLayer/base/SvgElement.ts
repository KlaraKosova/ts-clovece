import { G, Svg, Element, Circle, Rect, Text, Tspan, Path, Ellipse } from '@svgdotjs/svg.js'
import Consts from "../../../utils/svgBoardConstants";
import { camelToKebabCase, delay } from "../../../utils/common";
import { centers, homeCenters } from "../../../utils/fieldCenters";
import * as path from "path";
import { Coordinates } from '../../../types/Coordinates';

export class SvgElement {
    private draw: Svg;
    protected group: G;
    constructor(draw: Svg) {
        this.draw = draw
        this.group = draw.group()
    }

    addClass(className: string): void {
        this.group.node.classList.add(className)
    }

    setCSS(style: Partial<CSSStyleDeclaration>): void {
        this.group.css(style)
    }

    setDataset(data: Record<string, any>): void {
        Object.keys(data).forEach(key => {
            if (data.hasOwnProperty(key)) {
                this.group.data(camelToKebabCase(key), data[key], true)
            }
        })
    }


    /**
     * Creates new child element and adds it to the group
     * @param data
     * @param {string} data.type type
     */
    createChild(data: {
        type: 'rect',
        center: Coordinates,
        color: string,
        opacity?: number,
        size: Coordinates,
        radius?: number
    }): void;

    createChild(data: {
        type: 'ellipse',
        center: Coordinates,
        color: string,
        opacity?: number,
        ellipseRadius: Coordinates,
    }): void;

    createChild(data: {
        type: 'circle',
        center: Coordinates,
        color: string,
        opacity?: number,
        diameter: number
    }): void;

    createChild(data: {
        type: 'functionText',
        addFunction?: (add: any) => void
    }): void;

    createChild(data: {
        type: 'path',
        initialPosition: Coordinates,
        path: string,
        color: string,
        pathScale?: number
    }): void;

    createChild(data: {
        type: 'text',
        text: string,
        center: Coordinates,
        font: {
            leading?: string
            anchor?: string
            family?: string
            size?: string | number
            stretch?: string
            style?: string
            variant?: string
            weight?: string,
            fill?: string
        }
    }): void;


    createChild(data: {
        type: 'rect' | 'ellipse' | 'circle' | 'text' | 'functionText' | 'path',
        path?: string,
        initialPosition?: Coordinates,
        center?: { x: number, y: number },
        color?: string,
        opacity?: number,
        diameter?: number
        size?: { x: number, y: number },
        font?: Record<string, any>,
        text?: string,
        radius?: number,
        ellipseRadius?: Coordinates,
        addFunction?: (tspan: Tspan) => void,
        pathScale?: number
    }): void {
        if (data.addFunction) {
            this.draw.text(data.addFunction)
            return
        }
        let element: Circle | Rect | Text | Path | Ellipse
        if (data.type === 'rect') {
            element = this.draw.rect()
            if (data.size) {
                element.size(data.size.x * Consts.K, data.size.y * Consts.K)
            }
            if (data.radius) {
                element.radius(data.radius * Consts.K)
            }
        } else if (data.type === 'circle') {
            element = this.draw.circle(data.diameter * Consts.K)
        } else if (data.type === 'text') {
            element = this.draw.text(data.text || '')
            if (data.font && Object.keys(data.font).length) {
                element.font(data.font)
            }
        } else if (data.type === 'ellipse') {
            element = this.draw.ellipse(data.ellipseRadius.x * Consts.K, data.ellipseRadius.y * Consts.K)
        } else {
            const scale = data.pathScale ?? Consts.K
            let transformedPath = `M ${data.initialPosition.x * Consts.K} ${data.initialPosition.y * Consts.K} `
                + data.path
                    .split(' ')
                    .map(pathElement => {
                        return isNaN(+pathElement) ? pathElement : +pathElement * scale * 0.75
                    })
                    .join(' ')
            element = this.draw.path(transformedPath + ' z')
        }
        if (data.center) {
            element.center(data.center.x * Consts.K, data.center.y * Consts.K)
        }
        if (data.color) {
            element.fill({ color: data.color, opacity: data.opacity ?? 1 })
        }

        this.group.add(element)
    }

    /***
     * Iterates over child elements, calls passed function on each
     * @param {(Element) => void} fn
     */
    public callChildrenFunction(fn: (element: Element) => void): void {
        const children = this.group.children()
        for (let i = 0; i < children.length; i++) {
            fn(children[i])
        }
    }

    public getNthChild(n: number): Element {
        return this.group.children()[n - 1]
    }

    public async move(data: {
        duration: number,
        offset: Coordinates
    }): Promise<void>;

    public async move(data: {
        duration: number,
        center: Coordinates
    }): Promise<void>;

    public async move(data: {
        duration: number,
        offset?: Coordinates,
        center?: Coordinates
    }) {
        this.group.children().forEach((child: Element) => {
            const runner = child.animate(data.duration, 0, 'last')
            if (data.offset) {
                runner.dmove(data.offset.x * Consts.K, data.offset.y * Consts.K)
            } else if (data.center) {
                runner.center(data.center.x * Consts.K, data.center.y * Consts.K)
            }
        })

        await delay(data.duration)
    }
    /**
     * Removes all children from document tree
     */
    removeChildren() {
        this.group.clear()
    }

    destroy(): void {
        this.removeChildren()
        this.group.remove()
    }
}
