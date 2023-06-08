import {ModalEventTypes} from "@/types/state/ModalEventBusEventTypes";

class ModalEventBus {
    private events: Record<ModalEventTypes, Function[]> = {
        [ModalEventTypes.SHOW_NO_MOVES_MODAL]: [],
        [ModalEventTypes.CLEAR_ALL_SIDE_MODALS]: [],
        [ModalEventTypes.SHOW_HOME_MOVES_ONLY_MODAL]: []
    }

    publish(event: ModalEventTypes, ...args: any[]) {
        const callbackList = this.events[event];

        for (let callback of callbackList) {
            callback(...args);
        }
    }

    subscribe(event: ModalEventTypes, callback: Function) {
        // store the callback function of the subscriber
        this.events[event].push(callback);
    }
}

export const ModalEventBusInstance = new ModalEventBus()