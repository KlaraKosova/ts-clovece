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
    render() {
        let resultHtml =
            `<div class="game-cards-container">
                <div class="game-card">
                    <div>+ Vytvořit</div>
                </div>`
        /* const container = document.createElement('div')
        container.classList.add('game-cards-container')
        const newGameContainer = document.createElement('div')
        newGameContainer.classList.add('game-card')
        const newGameLabel = document.createElement('div')
        newGameLabel.textContent = 'Nová hra'
        newGameLabel.classList.add('game-name')
        const newGameButton = document.createElement('button')
        newGameButton.textContent = 'Vytvořit'
        newGameContainer.replaceChildren(newGameLabel, newGameButton)
        const gameContainers = [] */

        for (let i = 0; i < games.length; i++) {
            resultHtml +=
                `<div class="game-card" data-gameId="${games[i].gameId}">
                    <div class="game-name">ID: ${games[i].gameId}</div>
                    <div>Hráči: ${games[i].players}/4</div>
                    <button class="btn-full btn-green">Přidat se</button>
                </div>`;
            /* const gameContainerElement = document.createElement('div')
            const joinButtonElement = document.createElement('button')
            const headerElement = document.createElement('div')
            const subheaderElement = document.createElement('div')
            subheaderElement.textContent = `Hráči: ${games[i].players}/4`
            headerElement.textContent = `ID: ${games[i].gameId}`
            headerElement.classList.add('game-name')
            joinButtonElement.textContent = 'Přidat se'

            gameContainerElement.replaceChildren(headerElement, subheaderElement, joinButtonElement);
            gameContainerElement.classList.add('game-card')
            gameContainers.push(gameContainerElement); */
        }

        // container.replaceChildren(newGameContainer, ...gameContainers)
        resultHtml += "</div>";
        this.rootElem.innerHTML = resultHtml;
    }

    private renderNewGameDialog() {
        document.body.innerHTML += `
            <div class="modal modal-background">
                <div class="modal-wrapper">
                    <button class="btn-icon btn-red modal-close-btn">&times;</button>
                    <div class="modal-content">
                        <h2>Nová hra</h2>
                        <label class="input-label">Název</label>
                        <input class="input-text" />
                        <button class="btn-full btn-green">Vytvořit</button>
                    </div>
                </div>
            </div>
        `

        document.querySelector(".modal-close-btn").addEventListener('click', this.removeNewGameDialog.bind(this))
    }

    private removeNewGameDialog() {
        const modalElement = document.querySelector('.modal')
        document.body.removeChild(modalElement)
    }

    public registerListeners(): void {
        document.querySelector(".game-card:first-child").addEventListener('click', this.renderNewGameDialog.bind(this))
    }
    public removeListeners(): void {
        document.querySelector(".game-card:first-child").removeEventListener('click', this.renderNewGameDialog)
        document.querySelector(".modal-close-btn")?.removeEventListener('click', this.removeNewGameDialog)
    }
}