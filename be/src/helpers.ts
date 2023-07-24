export function checkEnv(config: any): void {
    if (typeof config !== 'object') {
        throw new Error('Incorrect top level .env format')
    }

    if (typeof config.frontendUrl !== 'string') {
        throw new Error("Incorrect .env format - property 'frontendUrl'")
    }
    if (typeof config.mongodbConnectionString !== 'string') {
        throw new Error("Incorrect .env format - property 'mongodbConnectionString'")
    }
    if (typeof config.mongodbDatabaseName !== 'string') {
        throw new Error("Incorrect .env format - property 'mongodbDatabaseName'")
    }
}
