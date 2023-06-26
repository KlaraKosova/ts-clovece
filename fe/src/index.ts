import App from './App'
import { SocketIOClientInstance } from './socketio/SocketClient'
import './resources/sass/styles.scss'
import '../node_modules/flag-icons/css/flag-icons.min.css'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import dotenv from 'dotenv/config'

SocketIOClientInstance.socket.on('connect', () => {
    App.init()
})
