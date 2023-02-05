import { SocketIOClientInstance } from "../socketio/SocketClient";
import { GamePreview } from "../types";
import { View } from "./View";

export class GameSelectView extends View {
    private games: GamePreview[] = [];
    render() {
        const container = document.createElement('div')
        container.classList.add('game-cards-container')
        const createGameCard = document.createElement('div')
        createGameCard.classList.add('game-card')
        createGameCard.innerHTML = '<div>+ Vytvořit</div>'

        container.appendChild(createGameCard)
        let resultHtml =
            `<div class="game-cards-container">
                <div class="game-card">
                    <div>+ Vytvořit</div>
                </div>`

        for (let i = 0; i < this.games.length; i++) {
            const wrapper = document.createElement('div')
            wrapper.classList.add('game-card')

            const nameWrapper = document.createElement('div')
            nameWrapper.classList.add('game-name')
            nameWrapper.textContent = this.games[i].name
            const playersWrapper = document.createElement('div')
            playersWrapper.textContent = `Hráči: ${this.games[i].players}/4`
            const joinButton = document.createElement('button')
            joinButton.classList.add('btn-full', 'btn-green')
            joinButton.textContent= 'Přidat se'
            joinButton.addEventListener('click', this.joinGame.bind(this, this.games[i]._id))

            wrapper.append(nameWrapper, playersWrapper, joinButton)
            container.append(wrapper)
        }

        this.rootElem.replaceChildren(container);
        this.registerHtmlListeners();
    }

    private renderNewGameDialog() {
        const modalElement = document.createElement('div')
        modalElement.classList.add('modal', 'modal-background')
        modalElement.innerHTML = `
            <div class="modal-wrapper">
                <button class="btn-icon btn-red modal-close-btn">&times;</button>
                <div class="modal-content">
                    <h2>Nová hra</h2>
                    <label class="input-label">Název</label>
                    <input class="input-text" placeholder="Hra bez názvu" />
                    <button class="btn-full btn-green" id="new-game-btn">Vytvořit</button>
                </div>
            </div>
        `
        this.rootElem.appendChild(modalElement)
        document.querySelector(".modal-close-btn").addEventListener('click', this.removeNewGameDialog.bind(this))
        document.querySelector("#new-game-btn").addEventListener('click', this.emitNewGame.bind(this))
    }

    private removeNewGameDialog() {
        const modalElement = document.querySelector('.modal')
        this.rootElem.removeChild(modalElement)
    }

    private emitNewGame() {
        const inputElement = document.querySelector(".modal .input-text") as HTMLInputElement | null
        // console.log(inputElement);

        SocketIOClientInstance.socket.emit("NEW_GAME", {
            name: inputElement?.value || "Hra bez názvu"
        })
    }

    private joinGame(gameId: string) {
        SocketIOClientInstance.socket.emit("JOIN_GAME", { gameId });
    }

    private onGameSelectResponse(data: { games: GamePreview[] }) {
        console.log('onGameSelectResponse')
        this.games = data.games
        this.render()
    }
    public registerHtmlListeners(): void {
        document.querySelector(".game-card:first-child").addEventListener('click', this.renderNewGameDialog.bind(this))
    }
    public registerSocketListeners(): void {
        SocketIOClientInstance.socket.on("GAME_SELECT_RESPONSE", this.onGameSelectResponse.bind(this))
    }
    public removeHtmlListeners(): void {
        document.querySelector(".game-card:first-child")?.removeEventListener('click', this.renderNewGameDialog)
        document.querySelector(".modal-close-btn")?.removeEventListener('click', this.removeNewGameDialog)
        document.querySelector("#new-game-btn")?.removeEventListener('click', this.emitNewGame)
    }
    public removeSocketListeners(): void {
        SocketIOClientInstance.socket.off("GAME_SELECT_RESPONSE")
    }

    public mount(): void {
        super.mount()
        SocketIOClientInstance.socket.emit("GAME_SELECT_REQUEST")
    }
}
