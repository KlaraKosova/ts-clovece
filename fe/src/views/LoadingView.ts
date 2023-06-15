import { createElement } from "@/utils/domHelpers";
import { View } from "./View";

export class LoadingView extends View {
    public render(): void {
        const container = createElement('div', [])
        container.textContent = 'tady by se hodila animace' // TODO
        this.rootElem.replaceChildren(container)
    }
}