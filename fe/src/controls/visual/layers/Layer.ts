import { type SvgComponent } from '../components/base/SvgComponent'
import { type LayerNames } from '@/types/LayerNames'
import { type G, type Svg } from '@svgdotjs/svg.js'

export class Layer {
    private readonly draw: Svg
    private readonly group: G
    private readonly name: LayerNames
    constructor (draw: Svg, name: LayerNames) {
        this.draw = draw
        this.group = draw.group()
        this.name = name
        // this.group.data('name', name)
    }

    public getName(): LayerNames {
        return this.name
    }

    public getGroup(): G {
        return this.group
    }

    public addElement(element: SvgComponent): void {
        element.addTo(this.group)
    }

    public insertAfter(group: G): void {
        this.group.insertAfter(group)
    }
}
