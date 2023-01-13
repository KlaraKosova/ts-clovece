import { View } from "./View";

export class LoadingView extends View {
    public render(): void {
        const container = document.createElement('div')
        container.textContent = 'tady by se hodila animace' // TODO
        this.rootElem.replaceChildren(container)
    }
    public removeListeners(): void {
        
    }
    public registerListeners(): void {
        
    }
}