export abstract class View {
    protected rootElem: HTMLElement;
    constructor() {
        this.rootElem = document.getElementById('app');
        if (!this.rootElem) {
            throw new Error("Root element #app not found");
        }
        this.registerSocketListeners()
    }
    public abstract viewInit(): void;
    public abstract render(): void;
    public abstract registerSocketListeners(): void;
    public abstract removeSocketListeners(): void;
    public abstract registerHtmlListeners(): void;
    public abstract removeHtmlListeners(): void;
}