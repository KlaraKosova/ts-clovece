import App from './App'
import { SocketIOClientInstance } from './socketio/SocketClient'
import './resources/sass/styles.scss'
import '../node_modules/flag-icons/css/flag-icons.min.css'
import { checkEnv } from './utils/common'
import env from '../config'

checkEnv(env)

SocketIOClientInstance.socket.on('connect', () => {
    App.init()
})
