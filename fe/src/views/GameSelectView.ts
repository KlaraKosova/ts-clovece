import { createElement } from "@/utils/domHelpers";
import { SocketIOClientInstance } from "../socketio/SocketClient";
import { GamePreviewDTO } from "../types/dtos/GamePreviewDTO";
import { View } from "./View";
import { locale } from "@/utils/locale";

export class GameSelectView extends View {
    private games: GamePreviewDTO[] = [];
    render() {
        const container = createElement('div', ['gamecards-container'])
        const containerHeader = createElement('div', ['gamecards-header'])
        const newGameButton = createElement('button', ['btn', 'btn-success', 'btn-newgame'], locale.get('newGame'))
        const containerContent = createElement('div', ['gamecards-content'], '')

        containerHeader.appendChild(newGameButton)
        container.replaceChildren(containerHeader, containerContent)

        for (let i = 0; i < this.games.length; i++) {
            const cardContainer = createElement('div', ['gamecard-container'], '')
            const cardTitle = createElement('div', ['gamecard-title'], this.games[i].name)
            const cardSubtitle = createElement('div', ['gamecard-subtitle'], `${locale.get('players')}: ${this.games[i].players}/4`)
            const cardJoinButton = createElement('button', ['btn', 'btn-success', 'gamecard-join'], locale.get('join'))
            cardJoinButton.addEventListener('click', this.joinGame.bind(this, this.games[i]._id))
    
            cardContainer.append(cardTitle, cardSubtitle, cardJoinButton)
            containerContent.append(cardContainer)
        }

        this.rootElem.replaceChildren(container);
        this.registerHtmlListeners();
    }

    private renderNewGameDialog() {
        const modalBackground = createElement('div', ['centermodal', 'centermodal-background'])
        const modalContainer = createElement('div', ['centermodal-container'])
        const modalCloseBtn = createElement('button', ['btn', 'btn-icon', 'btn-danger', 'centermodal-close'], '&times;')
        modalCloseBtn.addEventListener('click', this.removeNewGameDialog.bind(this))

        const modalHeader = createElement('div', ['centermodal-header'], locale.get('newGame'))
        const modalContent = createElement('div', ['centermodal-content'])

        const inputLabel = createElement('label', ['input', 'input-label'], locale.get('title'))
        const inputText = createElement('input', ['input', 'input-text'])
        inputText.setAttribute('placeholder', locale.get('untitledGame'))
        const createButton = createElement('button', ['btn', 'btn-success'], locale.get('create'))
        createButton.addEventListener('click', this.emitNewGame.bind(this))

        modalContent.replaceChildren(inputLabel, inputText, createButton)
        modalContainer.replaceChildren(modalCloseBtn, modalHeader, modalContent)
        modalBackground.appendChild(modalContainer)

        this.rootElem.appendChild(modalBackground)
    }

    private removeNewGameDialog() {
        const modalElement = document.querySelector('.centermodal')
        this.rootElem.removeChild(modalElement)
    }

    private emitNewGame() {
        const inputElement = document.querySelector(".centermodal .input-text") as HTMLInputElement | null
        console.log('emit NEW_GAME');

        SocketIOClientInstance.socket.emit("NEW_GAME", {
            name: inputElement?.value || locale.get('untitledGame')
        })
    }

    private joinGame(gameId: string) {
        console.log('emit JOIN_GAME');
        SocketIOClientInstance.socket.emit("JOIN_GAME", { gameId });
    }

    private onGameSelectResponse(data: { games: GamePreviewDTO[] }) {
        console.log('onGameSelectResponse')
        this.games = data.games
        this.render()
    }
    public registerHtmlListeners(): void {
        document.querySelector(".gamecards-header .btn-newgame").addEventListener('click', this.renderNewGameDialog.bind(this))
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
        console.log('emit GAME_SELECT_REQUEST');
        SocketIOClientInstance.socket.emit("GAME_SELECT_REQUEST")
    }
}
