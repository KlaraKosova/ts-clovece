import { logger } from '../../logger/Logger'

export abstract class DBError extends Error {
    public constructor(message: string, data: Record<string, any> = {}) {
        super(message)

        logger.error(message, data)
    }
}
