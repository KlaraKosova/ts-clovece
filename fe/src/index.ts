import App from "./App";
import { SocketIOClientInstance } from "./socketio/SocketClient";
import "./resources/sass/styles.scss"

SocketIOClientInstance.socket.on('connect', () => {
    App.init()
})
