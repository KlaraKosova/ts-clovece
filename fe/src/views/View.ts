export abstract class View {
    protected rootElem: HTMLElement;
    constructor () {
        this.rootElem = document.getElementById('app');
        if (!this.rootElem) {
            throw new Error("Root element #app not found");
        }
    }
    public abstract render(): void;
    public abstract registerListeners(): void;
    public abstract removeListeners(): void;
}