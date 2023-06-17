import { GameProgressView } from './views/GameProgressView'
import { GameSelectView } from './views/GameSelectView'
import { GameWaitingView } from './views/GameWaitingView'
import { LoadingView } from './views/LoadingView'
import { type View } from './views/View'
import { SocketIOClientInstance } from './socketio/SocketClient'
import { type UserInfo } from './types/UserInfo'
import { type ViewName } from './types/ViewName'
import { PlayersOrder } from './types/PlayerColors'
import { locale } from './utils/locale'
import { createElement } from './utils/domHelpers'

class App {
    private userInfo: UserInfo | null = null
    private currentView: View
    private readonly viewsDict: Record<ViewName, View>

    constructor() {
        this.viewsDict = {
            GAME_SELECT: new GameSelectView(),
            GAME_PROGRESS: new GameProgressView(),
            GAME_WAITING: new GameWaitingView(),
            LOADING: new LoadingView()
        }
        this.currentView = this.viewsDict.LOADING
        this.currentView.mount()
        this.registerSocketListeners()

        this.renderLangOptions()
    }

    /**
     * Load user information from local storage.
     */
    private loadUserInfo(): void {
        this.userInfo = null
        const localStorageInfo = JSON.parse(localStorage.getItem('user'))

        if (localStorageInfo &&
            typeof localStorageInfo.userId === 'string' &&
            typeof localStorageInfo.gameId === 'string' &&
            localStorageInfo.color in PlayersOrder
        ) {
            this.userInfo = {
                userId: localStorageInfo.userId,
                gameId: localStorageInfo.gameId,
                color: localStorageInfo.color
            }
        } else {
            localStorage.removeItem('user')
        }
    }

    public getUserInfo(): UserInfo {
        return this.userInfo
    }

    /**
     * Called after socketio'connect' event
     * Load user info and request info from server
     */
    public init(): void {
        console.log('init')
        this.loadUserInfo()
        if (this.userInfo) {
            console.log('emit INIT')

            SocketIOClientInstance.socket.emit('INIT', this.userInfo)
        } else {
            this.renderNewView('GAME_SELECT')
        }
    }

    private registerSocketListeners(): void {
        SocketIOClientInstance.socket.on('REDIRECT_GAME_WAIT', this.onRedirectGameWait.bind(this))
        SocketIOClientInstance.socket.on('REDIRECT_GAME_SELECT', this.onRedirectGameSelect.bind(this))
        SocketIOClientInstance.socket.on('REDIRECT_GAME_PROGRESS', this.onRedirectGameProgress.bind(this))
    }

    private onRedirectGameWait(data: UserInfo): void {
        console.log('onRedirectGameWait')
        this.userInfo = data
        localStorage.setItem('user', JSON.stringify(this.userInfo))
        this.renderNewView('GAME_WAITING')
    }

    private onRedirectGameSelect(): void {
        console.log('onRedirectGameSelect')
        localStorage.removeItem('user')
        this.renderNewView('GAME_SELECT')
    }

    private onRedirectGameProgress(): void {
        console.log('onRedirectGameProgress')
        this.renderNewView('GAME_PROGRESS')
    }

    private renderNewView(view: ViewName): void {
        this.currentView.unmount()
        this.currentView = this.viewsDict[view]
        this.currentView.mount()
    }

    public renderLangOptions(): void {
        // header should always exist
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const headerEnd = document.querySelector('.header-end')!
        const select = createElement('select', [])
        select.id = 'langSelect'

        locale.getSupportedLangs().forEach(lang => {
            const option = createElement('option', [], lang.label)
            option.setAttribute('value', lang.value)

            if (locale.getLang().value === lang.value) {
                option.setAttribute('selected', 'selected')
            }

            select.appendChild(option)
        })

        headerEnd.appendChild(select)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // injected using CDN
        const SlimSelect = window.SlimSelect

        // usage according to the official documentation
        // eslint-disable-next-line no-new
        new SlimSelect({
            select: '#langSelect',
            settings: {
                showSearch: false
            },
            events: {
                afterChange: (data: Array<{ text: string, value: string }>) => {
                    this.setLang(data)
                }
            }
        })
    }

    private setLang(data: Array<{ text: string, value: string }>): void {
        locale.setLang(data[0].value)
    }
}

export default new App()
