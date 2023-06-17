import { createElement } from '@/utils/domHelpers'
import { View } from './View'

export class GameWaitingView extends View {
    public render(): void {
        const container = createElement('div', [])
        container.textContent = 'tady by se hodila animace + info o poctu hracu' // TODO
        this.rootElem.replaceChildren(container)
    }
}
