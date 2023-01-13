import { UserInfo, ViewName } from "./types/types";
import { GameProgressView } from "./views/GameProgressView";
import { GameSelectView } from "./views/GameSelectView";
import { GameWaitingView } from "./views/GameWaitingView";
import { LoadingView } from "./views/LoadingView";
import { View } from "./views/View";

export class App {
    private userInfo: UserInfo = null;
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
        // TODO ostatni
    }
    /**
     * getUserInfo
     * Loads user information from local storage and returns it.
     */
    public getUserInfo(): UserInfo {
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
     */
    /* public init() {
        this.getUserInfo();
        if (this.userInfo) {
        } else {
            this.currentView = this.viewsDict.GAME_SELECT;
        }

        this.currentView.render()
    } */
    /**
     * force renderPage
     */
    public render() {
        this.currentView.removeListeners()
        this.getUserInfo();
        if (this.userInfo) {
        } else {
            this.currentView = this.viewsDict.GAME_SELECT;
        }

        this.currentView = this.viewsDict.GAME_PROGRESS

        this.currentView.render()
        this.currentView.registerListeners()
    }
}