import { Svg } from "@svgdotjs/svg.js";
import { SvgElement } from "./SvgElement";

export abstract class GameElement {
    protected svg: SvgElement;
    constructor(draw: Svg) {
        this.svg = new SvgElement(draw)
    }
    abstract render(): void;
    public hide() {
        this.svg.removeChildren();
    };
}
