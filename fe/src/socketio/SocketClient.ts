import { io } from 'socket.io-client'
import { type SocketIO } from './types'
import env from '../../config'

class SocketClient {
    private static instance: SocketClient | null
    public socket: SocketIO

    private constructor() {
        this.socket = io(env.socketServerUrl, {})
    }

    public static getInstance(): SocketClient {
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient()
        }
        return SocketClient.instance
    }
}

export const SocketIOClientInstance = SocketClient.getInstance()
