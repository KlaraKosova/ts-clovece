import { createElement } from '@/utils/domHelpers'
import { View } from './View'
import { SVG } from '@svgdotjs/svg.js'
import Consts from '@/utils/svgBoardConstants'
import { Loading } from '@/svgComponents/Loading'
import { locale } from '@/utils/locale'
import { ViewNames } from '@/types/ViewName'

export class LoadingView extends View {
    public render(): void {
        const mainContainer = createElement('div', ['loading-container'])
        const loadingContainer = createElement('div', ['loading-overlay', 'loading-overlay-container'])

        const loadingHeader = createElement('div', ['loading-overlay-header'], locale.get('loading'))
        const loadingContent = createElement('div', ['loading-overlay-content'])
        loadingContent.id = 'svgLoadingContainer'

        loadingContainer.replaceChildren(loadingHeader, loadingContent)
        mainContainer.appendChild(loadingContainer)

        this.rootElem.appendChild(mainContainer)

        const draw = SVG().addTo('#svgLoadingContainer').size(Consts.LOADING_VIEW.SIZE.X * Consts.K, Consts.LOADING_VIEW.SIZE.Y * Consts.K)
        const loading = new Loading(draw, ViewNames.LOADING)
        loading.render()
        loading.runAnimation()
    }
}
