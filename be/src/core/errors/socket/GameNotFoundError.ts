import type { SocketIO } from '../../../socketio/types'
import { logger } from '../../logger/Logger'
import { SocketError } from './SocketError'

export class GameNotFoundError extends SocketError {
    public constructor(socket: SocketIO, id: string) {
        const message = `Game ${id} not found`
        super(socket, message, {})

        logger.socketError(socket, message)
    }
}
