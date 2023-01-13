import { G, Svg, Element, Circle, Rect, Text } from '@svgdotjs/svg.js'
import Consts from "../helpers/svgBoardConstants";
import { Coordinates } from '../types'

export class SvgElement {
    private draw: Svg;
    protected group: G;
    constructor(draw: Svg) {
        this.draw = draw
        this.group = draw.group()
    }

    setId(id: string): void {
        this.group.node.setAttribute('id', id)
    }

    setCSS(style: Partial<CSSStyleDeclaration>): void {
        this.group.css(style)
    }

    setDataset(data: Record<string, any>): void {
        this.group.data({ ...data })
    }

    /***
     * Adds existing element to the group
     * @param {Element} element
     * @returns {number} Index of the added element
     */
    /* addChild(element: Element): number {
        this.group.add(element)
        return this.group.children().length - 1
    } */

    /***
     * Creates new child element and adds it to the group
     * @param data
     * @param {string} data.type type
     */
    createChild(data: {
        type: 'rect',
        center: Coordinates,
        color: string,
        size: { x: number, y: number },
        radius?: number
    }): void;

    createChild(data: {
        type: 'circle',
        center: Coordinates,
        color: string,
        diameter: number
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
            weight?: string
        }
    }): void;

    createChild(data: {
        type: 'rect' | 'circle' | 'text',
        center: { x: number, y: number },
        color?: string,
        diameter?: number
        size?: { x: number, y: number },
        font?: Record<string, any>,
        text?: string,
        radius?: number
    }): void {
        //
        let element: Circle | Rect | Text
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
        } else {
            element = this.draw.text(data.text || '')
            if (data.font && Object.keys(data.font).length) {
                element.font(data.font)
            }
        }
        element.center(data.center.x * Consts.K, data.center.y * Consts.K)
        if (data.color) {
            element.fill(data.color)
        }
        this.group.add(element)
    }

    /***
     * Iterates over child elements, calls passed function on each
     * @param {(Element) => void} fn
     */
    callChildrenFn(fn: (element: Element) => void, excludeIndexes: number[] = []): void {
        const children = this.group.children()
        for (let i = 0; i < children.length; i++) {
            if (excludeIndexes.includes(i)) {
                continue
            }
            fn(children[i])
        }
    }

    // TODO recursive
    /***
     * Removes all children from document tree
     * Not recursive
     */
    removeChildren() {
        this.group.clear()
    }

    destroy(): void {
        this.removeChildren()
        this.group.remove()
    }

    debug() {
        return this.group.dom
    }
}