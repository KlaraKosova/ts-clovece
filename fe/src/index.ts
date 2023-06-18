import App from './App'
import { SocketIOClientInstance } from './socketio/SocketClient'
import './resources/sass/styles.scss'
import "../node_modules/flag-icons/css/flag-icons.min.css"

SocketIOClientInstance.socket.on('connect', () => {
    App.init()
})
