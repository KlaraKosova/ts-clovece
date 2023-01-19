"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBCollectionError = exports.DBConnectionError = exports.DBError = exports.DbErrorStatus = void 0;
var DbErrorStatus;
(function (DbErrorStatus) {
    DbErrorStatus[DbErrorStatus["CONNECTION_ERROR"] = 0] = "CONNECTION_ERROR";
    DbErrorStatus[DbErrorStatus["COLLECTION_ERROR"] = 1] = "COLLECTION_ERROR";
    DbErrorStatus[DbErrorStatus["OTHER"] = 2] = "OTHER";
})(DbErrorStatus = exports.DbErrorStatus || (exports.DbErrorStatus = {}));
class DBError extends Error {
    constructor() {
        super(...arguments);
        this.dbErrorStatus = DbErrorStatus.OTHER;
    }
}
exports.DBError = DBError;
class DBConnectionError extends DBError {
    constructor(connectionString) {
        super();
        this.dbErrorStatus = DbErrorStatus.CONNECTION_ERROR;
        this.message = `Could not establish connection "${connectionString}"`;
    }
}
exports.DBConnectionError = DBConnectionError;
class DBCollectionError extends DBError {
    constructor(collectionName) {
        super();
        this.dbErrorStatus = DbErrorStatus.COLLECTION_ERROR;
        this.message = `Cannot access collection ${collectionName}`;
    }
}
exports.DBCollectionError = DBCollectionError;
