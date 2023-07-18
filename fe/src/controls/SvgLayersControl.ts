import { type SvgComponent } from './visual/components/base/SvgComponent'
import { LayerNames } from '@/types/LayerNames'
import { PlayerColors } from '@/types/PlayerColors'
import { Layer } from './visual/layers/Layer'
import { type Svg } from '@svgdotjs/svg.js'

export class SvgLayersControl {
    private readonly order: LayerNames[] = [
        LayerNames.BACKGROUND,
        LayerNames.FIELDS,
        LayerNames.FIGURES_RED,
        LayerNames.FIGURES_YELLOW,
        LayerNames.FIGURES_GREEN,
        LayerNames.FIGURES_BLUE,
        LayerNames.OVERLAY,
        LayerNames.DICE_BUTTONS_MODALS
    ]

    private readonly layers: Layer[] = []

    constructor(draw: Svg) {
        Object.values(LayerNames).forEach(l => {
            if (!this.order.includes(l)) {
                throw new Error(`Missing layer: ${l}`)
            }
        })

        this.order.forEach((layer) => {
            this.layers.push(new Layer(draw, layer))
        })
    }

    addToLayer(layer: LayerNames, component: SvgComponent): void {
        this.layers.find(l => l.getName() === layer)?.addElement(component)
    }

    raiseFigures(color: PlayerColors): void {
        let layer: LayerNames

        switch (color) {
            case PlayerColors.RED:
                layer = LayerNames.FIGURES_RED
                break
            case PlayerColors.YELLOW:
                layer = LayerNames.FIGURES_YELLOW
                break
            case PlayerColors.GREEN:
                layer = LayerNames.FIGURES_GREEN
                break
            case PlayerColors.BLUE:
                layer = LayerNames.FIGURES_BLUE
                break
        }

        const index = this.layers.findIndex(l => l.getName() === layer) // always found
        const removed = this.layers.splice(index, 1)[0]

        const previousLayer = this.layers[4]
        this.layers.splice(5, 0, removed)

        removed.insertAfter(previousLayer.getGroup())
    }
}
