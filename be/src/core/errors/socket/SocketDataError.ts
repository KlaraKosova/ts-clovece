import type { SocketIO } from '../../../socketio/types'
import { logger } from '../../logger/Logger'
import { SocketError } from './SocketError'

export class SocketDataError extends SocketError {
    public constructor(socket: SocketIO, data: Record<string, any> = {}) {
        const message = 'Invalid socket data'
        super(socket, message, data)

        logger.socketError(socket, message, data)
    }
}
