export enum DbErrorStatus {
    CONNECTION_ERROR,
    COLLECTION_ERROR,
    OTHER
}

export abstract class DBError extends Error {
    dbErrorStatus = DbErrorStatus.OTHER
}

export class DBConnectionError extends DBError {
    dbErrorStatus = DbErrorStatus.CONNECTION_ERROR

    constructor(connectionString: string) {
        super()
        this.message = `Could not establish connection "${connectionString}"`
    }
}

export class DBCollectionError extends DBError {
    dbErrorStatus = DbErrorStatus.COLLECTION_ERROR

    constructor(collectionName: string) {
        super()
        this.message = `Cannot access collection ${collectionName}`
    }
}
