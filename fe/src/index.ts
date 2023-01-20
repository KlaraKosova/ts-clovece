import App from "./App";
import { SocketIOClientInstance } from "./socketio/SocketClient";

SocketIOClientInstance.socket.on('connect', () => {
    App.init()
})