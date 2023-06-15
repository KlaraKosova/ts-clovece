import { GameProgressView } from "./views/GameProgressView";
import { GameSelectView } from "./views/GameSelectView";
import { GameWaitingView } from "./views/GameWaitingView";
import { LoadingView } from "./views/LoadingView";
import { View } from "./views/View";
import { SocketIOClientInstance } from "./socketio/SocketClient";
import { UserInfo } from "./types/common/UserInfo";
import { ViewName } from "./types/state/ViewName";
import { PlayersOrder } from "./types/common/PlayerColors";
import { locale } from "./utils/locale";
import { createElement } from "./utils/domHelpers";

class App {
    private userInfo: UserInfo | null = null;
    private currentView: View;
    private viewsDict: Record<ViewName, View>;

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
     * getUserInfo
     * Loads user information from local storage and returns it.
     */
    private loadUserInfo() {
        this.userInfo = null
        const localStorageInfo = JSON.parse(localStorage.getItem('user'));

        if (localStorageInfo
            && typeof localStorageInfo.userId === 'string'
            && typeof localStorageInfo.gameId === 'string'
            && localStorageInfo.color in PlayersOrder
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

    public getUserInfo() {
        return this.userInfo
    }

    /**
     * init
     * vola se po po 'connect' socket serveru
     */
    public async init() {
        console.log('init');
        this.loadUserInfo();
        if (this.userInfo) {
            console.log('emit INIT');

            SocketIOClientInstance.socket.emit("INIT", this.userInfo)
        } else {
            this.renderNewView("GAME_SELECT")
        }
    }

    private registerSocketListeners() {
        SocketIOClientInstance.socket.on("REDIRECT_GAME_WAIT", this.onRedirectGameWait.bind(this));
        SocketIOClientInstance.socket.on("REDIRECT_GAME_SELECT", this.onRedirectGameSelect.bind(this));
        SocketIOClientInstance.socket.on("REDIRECT_GAME_PROGRESS", this.onRedirectGameProgress.bind(this))
    }

    private onRedirectGameWait(data: UserInfo) {
        console.log("onRedirectGameWait")
        this.userInfo = data;
        localStorage.setItem('user', JSON.stringify(this.userInfo))
        this.renderNewView("GAME_WAITING")
    }

    private onRedirectGameSelect() {
        console.log('onRedirectGameSelect')
        localStorage.removeItem('user')
        this.renderNewView("GAME_SELECT")
    }

    private onRedirectGameProgress() {
        console.log('onRedirectGameProgress')
        this.renderNewView("GAME_PROGRESS")
    }

    private renderNewView(view: ViewName) {
        this.currentView.unmount()
        this.currentView = this.viewsDict[view]
        this.currentView.mount()
    }


    public async renderLangOptions() {
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

        // @ts-ignore
        const SlimSelect = window.SlimSelect

        new SlimSelect({
            select: '#langSelect',
            settings: {
                showSearch: false
            },
            events: {
                afterChange: (data: { text: string, value: string }[]) => this.setLang.call(this, data)
            }
        })
    }

    private setLang(data: { text: string, value: string }[]) {
        locale.setLang(data[0].value)
    }
}

export default new App()
