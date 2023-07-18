import { type G, type Svg } from '@svgdotjs/svg.js'
import { SvgElement } from './SvgElement'

export abstract class SvgComponent {
    protected svg: SvgElement
    constructor(draw: Svg) {
        this.svg = new SvgElement(draw)
    }

    abstract render(): void
    public clear(): void {
        this.svg.removeChildren()
    };

    public addTo(group: G): void {
        this.svg.addTo(group)
    }
}
