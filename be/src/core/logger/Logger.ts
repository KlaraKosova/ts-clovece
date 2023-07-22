import winston from 'winston'
import { type SocketIO } from '../../socketio/types'

class Logger {
    private readonly logger: winston.Logger

    constructor() {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' })
            ],
            exceptionHandlers: [
                // handle uncaught exceptions
                new winston.transports.File({ filename: 'logs/exceptions.log' })
            ],
            rejectionHandlers: [
                new winston.transports.File({ filename: 'logs/exceptions.log' })
            ]
        })
    }

    socketError(socket: SocketIO, message: string, data: Record<string, any> = {}): void {
        this.logger.error(`Error: ${message} | Additional data: ${JSON.stringify(data)} | Socket headers: ${JSON.stringify(socket.client.conn.request.headers)}`)
    }

    socketInfo(socket: SocketIO, message: string, data: Record<string, any> = {}): void {
        this.logger.info(`Info: ${message} | Additional data: ${JSON.stringify(data)} | Socket headers: ${JSON.stringify(socket.client.conn.request.headers)}`)
    }

    error(message: string, data: Record<string, any> = {}): void {
        this.logger.info(`Info: ${message} | Additional data: ${JSON.stringify(data)}`)
    }
}

export const logger = new Logger()
