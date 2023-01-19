import { View } from "./View";

export class GameWaitingView extends View {
    public render(): void {
        const container = document.createElement('div')
        container.textContent = 'tady by se hodila animace + info o poctu hracu' // TODO
        this.rootElem.replaceChildren(container)
    }
    public viewInit(): void {

    }
    public registerHtmlListeners(): void {

    }
    public registerSocketListeners(): void {

    }
    public removeHtmlListeners(): void {

    }
    public removeSocketListeners(): void {

    }
}