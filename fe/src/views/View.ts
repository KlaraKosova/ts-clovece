export abstract class View {
    protected rootElem: HTMLElement;
    constructor() {
        this.rootElem = document.getElementById('app');
        if (!this.rootElem) {
            throw new Error("Root element #app not found");
        }
        this.registerSocketListeners()
    }
    protected abstract render(): void;
    protected registerSocketListeners() {};
    protected removeSocketListeners() {};
    protected registerHtmlListeners() {};
    protected removeHtmlListeners() {};
    public mount() {
        this.render()
        this.registerHtmlListeners()
    };
    public unmount() {
        this.removeHtmlListeners()
    };
}