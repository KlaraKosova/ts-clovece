import { Svg } from '@svgdotjs/svg.js'

export abstract class SvgElement {
    protected draw: Svg;
    constructor(draw: Svg) {
        this.draw = draw;
    }
    abstract render(): void;
}