import { logger } from '../../logger/Logger'
import { DBError } from './DBError'

export class DBCollectionError extends DBError {
    constructor(collectionName: string) {
        const message = `Cannot access collection ${collectionName}`
        super(message)

        logger.error(message)
    }
}
