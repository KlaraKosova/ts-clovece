import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, SocketIO } from "./types";

class SocketClient {
    private static instance: SocketClient | null;
    public socket: SocketIO | null;

    private constructor() {
        this.socket = io(process.env.SOCKET_SERVER_URL || 'http://localhost:3001', {});
    }

    public static getInstance(): SocketClient {
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient()
        }
        return SocketClient.instance
    }
}


export const SocketIOClientInstance = SocketClient.getInstance()