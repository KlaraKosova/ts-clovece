import { SocketIOClientInstance } from "../socketio/SocketClient";
import { GamePreview } from "../types";
import { View } from "./View";

const games = [
    {
        gameId: 123,
        players: 3
    },
    {
        gameId: 456,
        players: 2
    }
]

export class GameSelectView extends View {
    private games: GamePreview[] = [];
    render() {
        this.removeHtmlListeners();
        let resultHtml =
            `<div class="game-cards-container">
                <div class="game-card">
                    <div>+ Vytvořit</div>
                </div>`

        for (let i = 0; i < this.games.length; i++) {
            resultHtml +=
                `<div class="game-card" data-gameId="${this.games[i]._id}">
                    <div class="game-name">ID: ${this.games[i].name}</div>
                    <div>Hráči: ${this.games[i].players}/4</div>
                    <button class="btn-full btn-green">Přidat se</button>
                </div>`;
        }

        resultHtml += "</div>";
        this.rootElem.innerHTML = resultHtml;
        this.registerHtmlListeners();
    }

    private renderNewGameDialog() {
        document.body.innerHTML += `
            <div class="modal modal-background">
                <div class="modal-wrapper">
                    <button class="btn-icon btn-red modal-close-btn">&times;</button>
                    <div class="modal-content">
                        <h2>Nová hra</h2>
                        <label class="input-label">Název</label>
                        <input class="input-text" placeholder="Hra bez názvu" />
                        <button class="btn-full btn-green" id="new-game-btn">Vytvořit</button>
                    </div>
                </div>
            </div>
        `

        document.querySelector(".modal-close-btn").addEventListener('click', this.removeNewGameDialog.bind(this))
        document.querySelector("#new-game-btn").addEventListener('click', this.emitNewGame.bind(this))
    }

    private removeNewGameDialog() {
        const modalElement = document.querySelector('.modal')
        document.body.removeChild(modalElement)
    }

    private emitNewGame() {
        const inputElement = document.querySelector("#new-game-btn") as HTMLInputElement | null

        SocketIOClientInstance.socket.emit("NEW_GAME", {
            name: inputElement?.value || "Hra bez názvu"
        })
    }

    private onGameSelectResponse(data: { games: GamePreview[] }) {
        this.games = data.games
        this.render()
    }

    public viewInit(): void {
        SocketIOClientInstance.socket.emit("GAME_SELECT_REQUEST")
    }
    public registerHtmlListeners(): void {
        document.querySelector(".game-card:first-child").addEventListener('click', this.renderNewGameDialog.bind(this))
    }
    public registerSocketListeners(): void {
        SocketIOClientInstance.socket.on("GAME_SELECT_RESPONSE", this.onGameSelectResponse.bind(this))
    }
    public removeHtmlListeners(): void {
        document.querySelector(".game-card:first-child").removeEventListener('click', this.renderNewGameDialog)
        document.querySelector(".modal-close-btn")?.removeEventListener('click', this.removeNewGameDialog)
        document.querySelector("#new-game-btn")?.removeEventListener('click', this.emitNewGame)
    }
    public removeSocketListeners(): void {
        SocketIOClientInstance.socket.off("GAME_SELECT_RESPONSE")
    }
}