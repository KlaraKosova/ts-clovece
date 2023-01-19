import {MongoClient, Db, Collection} from "mongodb";

import dotenv from "dotenv";
import {DBCollectionError, DBConnectionError} from "./Error.js";
dotenv.config();

class Client {
    private client: MongoClient;
    private db = null as Db | null;

    private constructor() {
        if (!process.env.MONGODB_CONNECTION_STRING) {
            throw new DBConnectionError('')
        }
        this.client = new MongoClient(process.env.MONGODB_CONNECTION_STRING)

    }
    static async getClient(): Promise<Client> {
        const client = new Client()

        try {
            await client.client.connect();
            client.db = client.client.db(process.env.MONGODB_DATABASE_NAME)
            console.log("Connected successfully to the DB");
        } catch (e) {
            await client.client.close();
            throw new DBConnectionError(process.env.MONGODB_CONNECTION_STRING!)
        }

        return client
    }
    collection(collection: string):Collection {
        if (!this.db) {
            throw new DBCollectionError(collection)
        }
        return this.db.collection(collection)
    }
    async disconnect (): Promise<void> {
        await this.client.close();
    }

}

export default Client
