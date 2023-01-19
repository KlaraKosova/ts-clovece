"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const Error_js_1 = require("./Error.js");
dotenv_1.default.config();
class Client {
    constructor() {
        this.db = null;
        if (!process.env.MONGODB_CONNECTION_STRING) {
            throw new Error_js_1.DBConnectionError('');
        }
        this.client = new mongodb_1.MongoClient(process.env.MONGODB_CONNECTION_STRING);
    }
    static getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new Client();
            try {
                yield client.client.connect();
                client.db = client.client.db(process.env.MONGODB_DATABASE_NAME);
                console.log("Connected successfully to the DB");
            }
            catch (e) {
                yield client.client.close();
                throw new Error_js_1.DBConnectionError(process.env.MONGODB_CONNECTION_STRING);
            }
            return client;
        });
    }
    collection(collection) {
        if (!this.db) {
            throw new Error_js_1.DBCollectionError(collection);
        }
        return this.db.collection(collection);
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
        });
    }
}
exports.default = Client;
