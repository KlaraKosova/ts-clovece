import { Runner } from "@svgdotjs/svg.js"

export interface HasHighlightAnimation {
    highlightAnimationStart(): void
    highlightAnimationStop(): void
}