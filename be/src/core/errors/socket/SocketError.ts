import type { SocketIO } from '../../../socketio/types'
import { logger } from '../../logger/Logger'

export abstract class SocketError extends Error {
    public constructor(socket: SocketIO, message: string, data: Record<string, any> = {}) {
        super(message)

        logger.socketError(socket, message, data)
    }
}
