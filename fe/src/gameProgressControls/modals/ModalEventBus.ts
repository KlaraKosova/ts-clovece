import { ModalEventTypes } from '@/types/ModalEventBusEventTypes'
import { type VarParamFunction } from '@/types/utils'

class ModalEventBus {
    private readonly events: Record<ModalEventTypes, Array<VarParamFunction<void>>> = {
        [ModalEventTypes.SHOW_NO_MOVES_MODAL]: [],
        [ModalEventTypes.CLEAR_ALL]: [],
        [ModalEventTypes.SHOW_HOME_MOVES_ONLY_MODAL]: [],
        [ModalEventTypes.SHOW_CURRENT_PLAYER_MODAL]: [],
        [ModalEventTypes.SHOW_GAME_OVER_MODAL]: []
    }

    publish(event: ModalEventTypes, ...args: any[]): void {
        const callbackList = this.events[event]

        for (const listener of callbackList) {
            listener(...args)
        }
    }

    subscribe(event: ModalEventTypes, callback: VarParamFunction<void>): void {
        this.events[event].push(callback)
    }
}

export const ModalEventBusInstance = new ModalEventBus()
