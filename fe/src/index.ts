import { App } from "./App";
import { SocketIOClientInstance } from "./socketio/SocketClient";

const app = new App();
app.start();

SocketIOClientInstance.socket.on('connect', () => {
    app.init()
})