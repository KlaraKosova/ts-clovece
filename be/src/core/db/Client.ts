import { MongoClient, type Db, type Collection } from 'mongodb'
import config from '../../../config.js'
import { DBCollectionError } from '../errors/db/DBCollectionError.js'
import { DBConnectionError } from '../errors/db/DBConnectionError.js'

class Client {
    private readonly client: MongoClient
    private db = null as Db | null

    private constructor() {
        if (!config.mongodbConnectionString) {
            throw new DBConnectionError('')
        }
        this.client = new MongoClient(config.mongodbConnectionString)
    }

    static async getClient(): Promise<Client> {
        const client = new Client()

        try {
            await client.client.connect()
            client.db = client.client.db(config.mongodbDatabaseName)
            // console.log('Connected successfully to the DB')
        } catch (e: any) {
            await client.client.close()
            throw new DBConnectionError(config.mongodbConnectionString)
        }

        return client
    }

    collection(collection: string): Collection {
        if (!this.db) {
            throw new DBCollectionError(collection)
        }
        return this.db.collection(collection)
    }

    async disconnect(): Promise<void> {
        await this.client.close()
    }
}

export default Client
