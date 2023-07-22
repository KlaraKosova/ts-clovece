import { logger } from '../../logger/Logger'
import { DBError } from './DBError'

export class DBConnectionError extends DBError {
    constructor(connectionString: string) {
        const message = `Could not establish connection "${connectionString}"`
        super(message)
        logger.error(message)
    }
}
