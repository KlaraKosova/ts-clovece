export abstract class View {
    protected rootElem: HTMLElement
    constructor() {
        const rootElem = document.getElementById('app')

        if (!rootElem) {
            throw new Error('Root element #app not found')
        }

        this.rootElem = rootElem
    }

    protected abstract render(): void
    protected registerSocketListeners(): void {};
    protected removeSocketListeners(): void {};
    protected registerHtmlListeners(): void {};
    protected removeHtmlListeners(): void {};

    public mount(): void {
        this.render()
        this.registerHtmlListeners()
        this.registerSocketListeners()
    };

    public unmount(): void {
        this.removeHtmlListeners()
        this.removeSocketListeners()
        this.rootElem.replaceChildren()
    };
}
