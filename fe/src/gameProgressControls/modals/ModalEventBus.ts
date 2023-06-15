import {ModalEventTypes} from "@/types/ModalEventBusEventTypes";

class ModalEventBus {
    private events: Record<ModalEventTypes, Function[]> = {
        [ModalEventTypes.SHOW_NO_MOVES_MODAL]: [],
        [ModalEventTypes.CLEAR_ALL]: [],
        [ModalEventTypes.SHOW_HOME_MOVES_ONLY_MODAL]: [],
        [ModalEventTypes.SHOW_CURRENT_PLAYER_MODAL]: [],
        [ModalEventTypes.SHOW_GAME_OVER_MODAL]: []
    }

    publish(event: ModalEventTypes, ...args: any[]) {
        const callbackList = this.events[event];

        for (let callback of callbackList) {
            callback(...args);
        }
    }

    subscribe(event: ModalEventTypes, callback: Function) {
        this.events[event].push(callback);
    }
}

export const ModalEventBusInstance = new ModalEventBus()