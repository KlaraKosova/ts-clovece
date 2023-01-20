import { UserInfo, ViewName } from "./types";
import { GameProgressView } from "./views/GameProgressView";
import { GameSelectView } from "./views/GameSelectView";
import { GameWaitingView } from "./views/GameWaitingView";
import { LoadingView } from "./views/LoadingView";
import { View } from "./views/View";
import { SocketIOClientInstance } from "./socketio/SocketClient";

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

    }
    /**
     * getUserInfo
     * Loads user information from local storage and returns it.
     */
    private loadUserInfo(): UserInfo {
        const localStorageInfo = JSON.parse(localStorage.getItem('user'));

        if (localStorageInfo && typeof localStorageInfo.userId === 'number' && typeof localStorageInfo.gameId === 'number') {
            this.userInfo = {
                userId: localStorageInfo.userId,
                gameId: localStorageInfo.gameId,
            }
        }
        return this.userInfo;
    }

    /**
     * init
     * vola se po po 'connect' socket serveru
     */
    public async init() {
        this.loadUserInfo();
        if (this.userInfo) {
            SocketIOClientInstance.socket.emit("INIT", this.userInfo)
        } else {
            this.currentView = this.viewsDict.GAME_SELECT;
            this.currentView.mount()
        }
    }

    private registerSocketListeners() {
        SocketIOClientInstance.socket.on("REDIRECT_GAME_WAIT", this.onRedirectGameWait.bind(this));
        SocketIOClientInstance.socket.on("REDIRECT_GAME_SELECT", this.onRedirectGameSelect.bind(this));
    }

    private onRedirectGameWait(data: UserInfo) {
        this.userInfo = data;
        localStorage.setItem('userId', this.userInfo.userId)
        localStorage.setItem('gameId', this.userInfo.gameId)
        this.renderNewView("GAME_WAITING")
    }

    private onRedirectGameSelect() {
        localStorage.removeItem('userId')
        localStorage.removeItem('gameId')
        this.renderNewView("GAME_SELECT")
    }

    private renderNewView(view: ViewName) {
        this.currentView.unmount()
        this.currentView = this.viewsDict[view]
        this.currentView.mount()
    }
}

export default new App()