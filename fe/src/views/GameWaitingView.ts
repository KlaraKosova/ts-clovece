import { createElement } from '@/utils/domHelpers'
import { View } from './View'
import { locale } from '@/utils/locale'
import { SVG } from '@svgdotjs/svg.js'
import Consts from '@/utils/svgBoardConstants'
import { Loading } from '@/svgComponents/Loading'
import { ViewNames } from '@/types/ViewName'
import {SocketIOClientInstance} from "@/socketio/SocketClient";

export class GameWaitingView extends View {
    private players: number = 1
    public render(): void {
        const mainContainer = createElement('div', ['loading-container'])
        const loadingContainer = createElement('div', ['loading-overlay', 'loading-overlay-container'])

        const loadingHeader = createElement('div', ['loading-overlay-header'], locale.get('waitingForOtherPlayers'))
        const loadingContent = createElement('div', ['loading-overlay-content'])
        const playersText = createElement('div', [], `${locale.get('players')}: ${this.players}/4`)
        playersText.id = 'playersTextContainer'

        loadingContent.prepend(playersText)
        loadingContent.id = 'svgLoadingContainer'

        loadingContainer.replaceChildren(loadingHeader, loadingContent)
        mainContainer.appendChild(loadingContainer)

        this.rootElem.appendChild(mainContainer)

        const draw = SVG().addTo('#svgLoadingContainer').size(Consts.LOADING_VIEW.SIZE.X * Consts.K, Consts.LOADING_VIEW.SIZE.Y * Consts.K)
        const loading = new Loading(draw, ViewNames.LOADING)
        loading.render()
        loading.runAnimation()
    }

    public setPlayers(players: number): void {
        this.players = players
        const container = document.getElementById('playersTextContainer')
        if (!container) {
            throw new Error('View not mounted')
        }

        container.textContent = `${locale.get('players')}: ${this.players}/4`
    }

    private handleGameWaitUpdate(data: { players: number}) {
        this.setPlayers(data.players)
    }

    protected registerSocketListeners() {
        super.registerSocketListeners()

        SocketIOClientInstance.socket.on('GAME_WAIT_UPDATE', this.handleGameWaitUpdate.bind(this))
    }

    protected removeSocketListeners() {
        super.removeSocketListeners();

        SocketIOClientInstance.socket.off('GAME_WAIT_UPDATE')
    }
}
